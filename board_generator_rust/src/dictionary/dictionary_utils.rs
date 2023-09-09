use std::{
    collections::{HashMap, HashSet},
    fs::{self, File},
    io::{BufRead, BufReader},
    path::Path,
};

use crate::config::Config;

use super::DictionaryManager;

// ==============Dictionary File Utilties==============

///
/// Reads the (clean) dictionary file into a Vector of words
///
pub fn read_clean_dictionary(dictionary_filepath: &str) -> Vec<String> {
    // Open the clean words dictionary file
    let dictionary_file = File::open(Path::new(dictionary_filepath))
        .expect("Could not locate the clean dictionary file!");

    // Read each dictionary word into a vector
    let clean_words: Vec<String> = BufReader::new(dictionary_file)
        .lines()
        .map(|l| {
            l.expect("Could not parse a word from clean words dictionary.")
        })
        .collect();

    clean_words
}

///
/// Creates a new "clean" dictionary file on disk.
///
/// We don't need to run this often, just use it any time
/// you add words to the "bad words" dictionary.
///
/// __The process looks like:__
///     1) Read in the base dictionary file with unfiltered words
///     2) Remove any words that are too short or too long
///     3) Remove any cuss words that are found within the "bad words" file
///     4) Remove any weird symbols or spaces from words
///     5) Write the "clean" dictionary file back to disk.
///
fn process_new_clean_dictionary(
    base_dictionary_file_path: &str,
    bad_words_file_path: &str,
    output_dictionary_file_path: &str,
) {
    // Blacklist File
    // Contains the "bad words" that should be excluded
    let blacklist_file = File::open(bad_words_file_path)
        .expect("Could not locate the bad words file!");
    let blacklist_words_set: HashSet<String> = BufReader::new(blacklist_file)
        .lines()
        .map(|l| l.expect("Could not parse line of bad words"))
        .map(|word| word.trim().to_lowercase())
        .collect();

    // Base Dictionary File
    // Contains the unfiltered words that need to be filtered
    let dictionary_file = File::open(base_dictionary_file_path)
        .expect("Could not locate the base dictionary file!");
    let dictionary_reader = BufReader::new(dictionary_file);

    // Process all of the words to create the "Clean Dictionary Words"
    let mut clean_words = Vec::new();
    for word in dictionary_reader.lines().flatten() {
        // Clean up the string, remove spaces, remove non a-z characters
        let trimmed_word: String = word
            .trim()
            .chars()
            .filter(|c| c.is_ascii_alphabetic())
            .collect();

        // Only keep the word if it is an appropriate length and
        // exclude any "bad words" found within the bad_words dictionary.
        if trimmed_word.len() > 3
            && trimmed_word.len() < 8
            && !blacklist_words_set.contains(&trimmed_word)
        {
            clean_words.push(trimmed_word.to_lowercase());
        }
    }

    // Write the clean dictionary to a file so we don't have to
    // do all the processing next time
    fs::write(output_dictionary_file_path, clean_words.join("\n"))
        .expect("Could not write to the clean dictionary file.");
}

///
/// Writes a new "Precomputed Words File". This is a JSON file which maps
/// each word to a list of all of the words that can be constructed
/// using all or some of the letters of the original word.
///
fn write_precomputed_file(
    filepath: &str,
    precomputed_words: &HashMap<String, Vec<String>>,
) {
    if let Ok(json_to_write) = serde_json::to_string(precomputed_words) {
        fs::write(filepath, json_to_write)
            .expect("Could not write the precomputed word-map file.");
    }
}

///
///
fn find_all_subwords_for_all_seven_letter_words(
    min_words_necessary_to_save: usize,
    dictionary: &DictionaryManager,
) -> HashMap<String, Vec<String>> {
    // Build a new precomputed words map
    let mut precomputed_words_map: HashMap<String, Vec<String>> =
        HashMap::new();
    if let Some(all_seven_letter_words) = dictionary.get_all_words_of_length(7)
    {
        for one_seven_letter_word in all_seven_letter_words.iter() {
            //
            let mut all_words_for_letters = dictionary
                .find_all_words_for_letters(one_seven_letter_word, true);

            //
            all_words_for_letters.retain(|word| word != one_seven_letter_word);

            //
            if all_words_for_letters.len() >= min_words_necessary_to_save {
                precomputed_words_map.insert(
                    one_seven_letter_word.to_string(),
                    all_words_for_letters,
                );
            }
        }
    }

    precomputed_words_map
}

///
/// This utility manages all of the dictionary files used by
/// the application.
///
/// __A quick overview:__
/// - There is a `"Base Dictionary File"` which contains an incredible
///   number of english words. These aren't filtered at all, neither
///   by content, meaning, or character length. Just a raw .txt dictionary file.
/// - There is a `"Bad Words File"`. The words in this are primarily
///   inappropriate cuss words, but could also just be any word that we don't
///   want to appear in the game. The words from this file will never appear
///   in the finalize "clean dictionary file". This is a basic .txt. file.
/// - There is a `"Pre-Computed SubWords file"`. This is a .json file that maps
///   every possible "starting word", to a list of all the words that can be
///   constructed by using some or all of the letters of the starting word.
///   `Example: { are: ["era", "ear"] }`
///
pub fn create_all_dictionary_files(all_config: &Config) {
    // 1) Process the base dictionary files, create a
    //    new "clean" dictionary file, and write to disk
    process_new_clean_dictionary(
        &all_config.app.base_dictionary_filepath,
        &all_config.app.bad_words_filepath,
        &all_config.app.clean_dictionary_filepath,
    );

    // 2) Instantiate a new DictionaryManager and tell it to read in
    //    the brand new "Clean Dictionary" file
    let mut dictionary = DictionaryManager::default();
    dictionary.load_clean_dictionary(&all_config.app.clean_dictionary_filepath);

    // 3) Calculate every word that can be constructed from every seven-letter word.
    //    Store this in a HashMap (which will be written to a JSON file in a moment)
    let all_subwords_map = find_all_subwords_for_all_seven_letter_words(
        all_config.generator.min_words_to_consider_letters,
        &dictionary,
    );

    // 4) JSON Serialize the pre-computed map of every subword that can be built
    //    from the letters of every seven-letter word. Then write it to a JSON file.
    write_precomputed_file(
        &all_config.app.precomputed_words_filepath,
        &all_subwords_map,
    )
}
