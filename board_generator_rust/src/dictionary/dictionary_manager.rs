use super::dictionary_utils::*;
use crate::utils::get_random_int_in_range;
use itertools::Itertools;
use rand::seq::SliceRandom;
use std::collections::HashMap;

const PRECOMPUTED_JSON: &'static str = include_str!("../../dictionary_files/precomputed_words.json");

///
/// The DictionaryManager is a utility class used to do things like
/// load a dictionary file into memory, perform some parsing and categorization
/// of the words in the dictionary to make it easy to look-up words.
///
/// One thing you can do is say "give me a random word from the dictionary
/// that has seven characters".
///
/// Another useful purpose is to be able to say "give me every word in the dictionary
/// which can be built from these letters".
///
#[derive(Debug, Default)]
pub struct DictionaryManager {
    all_words: Vec<String>,
    by_length: HashMap<usize, Vec<String>>,
    to_sorted: HashMap<String, Vec<char>>,
    subwords_map: HashMap<String, Vec<String>>,
    subwords_keys: Vec<String>,
}

// ===============Static Methods=================

impl DictionaryManager {
    /// Constructor for creating new DictionaryManagers
    pub fn new() -> Self {
        Self::default()
    }
}

// ===============Instance Methods===============

impl DictionaryManager {
    ///
    /// Loads a new "clean" dictionary file into memory, and parses
    /// it to be used internally. After running this, all words
    /// in the dictionary file should be grouped by character length.
    ///
    pub fn load_clean_dictionary(&mut self, dictionary_filepath: &str) {
        // Load the dictionary file into a Vector of words
        let all_words = read_clean_dictionary(dictionary_filepath);
        self.all_words = all_words.clone();

        // Group the words by character length in a HashMap where the keys
        // are the character lengths, and the values are an array of
        // the words of that character length.
        let mut by_length = HashMap::new();
        for word in all_words.iter() {
            by_length
                .entry(word.len())
                .or_insert_with(Vec::new)
                .push(word.to_owned());
        }
        self.by_length = by_length;

        // Pre-sort every word so that they can be quickly compared
        // later, for faster lookups when we do partial word searches
        let mut to_sorted = HashMap::new();
        for word in all_words.iter() {
            to_sorted.insert(word.to_owned(), word.chars().sorted().collect());
        }
        self.to_sorted = to_sorted;
    }

    ///
    /// Loads the dictionary file which contains all of the
    /// seven-letter words, and maps each of them to all of the words
    /// it's letters can create.
    ///
    pub fn load_precomputed_dictionary(&mut self) {
        if let Ok(precomputed_words) = serde_json::from_str::<HashMap<String, Vec<String>>>(PRECOMPUTED_JSON) {
            // 5MB ram
            let keys: Vec<String> = precomputed_words
                .keys()
                .map(|word| word.to_owned())
                .collect();
            self.subwords_keys = keys;
            // 15MB ram
            self.subwords_map = precomputed_words;
        }
    }

    pub fn get_random_starting_word(&self) -> Option<(&String, &Vec<String>)> {
        let random_word = self.subwords_keys.choose(&mut rand::thread_rng())?;

        self.subwords_map.get_key_value(random_word)
    }

    ///
    /// Randomly selects a word that has the given number of characters.
    /// This depends on the DictionaryManager having already parsed
    /// a dictionary file "by length".
    ///
    pub fn get_random_word_by_length(
        &self,
        number_of_characters: usize,
    ) -> Option<String> {
        // All the words that have the correct number of characters
        let words_of_length = self.by_length.get(&number_of_characters)?;

        // Choose a random index within the range of characters available
        // (Effectively choosing a random word from vector of words)
        let random_word_index =
            get_random_int_in_range(0, words_of_length.len());

        // Grab that random word from the vector and return it
        let word_of_length =
            words_of_length.get(random_word_index)?.to_string();

        Some(word_of_length)
    }

    ///
    /// Given some letters, this utility will search the entire dictionary
    /// for all words that can be constructed using either some or all of
    /// the given letters.
    ///
    /// To help reduce MEMORY complexity, the searching algorithm
    /// will use pointers and loops rather than letter counters.
    ///
    /// Here is an explanation of the algorithm used to find words that can
    /// be built using some or all of the given letters-set:
    ///
    /// 1) First, all dictionary words must have their characters sorted the same
    ///     way as the given letters-set. The dictionary words are pre-sorted
    ///     during app initialization. Ex: `nathan` -> `aahnnt`
    /// 2) For each word in the dictionary (dictionary word), it will be compared to the given
    ///     letters of the "find-word" in the following way:
    /// 3) There is a pointer to the first letter of each word.
    /// 4) We compare each letter from the find word, to the dictionary word. If two letters
    ///     match, then we advance both pointers. If they don't match, we only
    ///     advance the "find-word" pointer to the next letter of the letters-set.
    ///     1) If we get through all letters of the dictionary-word, then that word is a match.
    ///     2) If we get through all letters of the find-word, then the dictionary
    ///     word cannot be built from the find-word.
    ///
    pub fn find_all_words_for_letters(
        &self,
        given_letters_set: &str,
        can_be_looked_up: bool,
    ) -> Vec<String> {
        // The algorithm I used for finding words that can be built
        // from a set of letters requires the set of letters to be sorted
        // the same way as the dictionary words.
        let letters_to_find: Vec<char> = if can_be_looked_up {
            // If the letters are in the form of a known word,
            // that has been presorted. You know it can be looked up
            // if you originally got the word by calling
            // self.get_random_word_by_length()
            self.to_sorted[given_letters_set].clone()
        } else {
            // If the letters are just letters, and not an actual word.
            given_letters_set.chars().sorted().collect_vec()
        };
        // let letters_to_find = &self.to_sorted[given_letters_set];
        let number_of_letters_to_find = letters_to_find.len();

        // This will hold all of the words that can be build from
        // the given letters.
        let mut matching_words: Vec<String> = Vec::new();

        // Flag sets whether or not each dictionary word can be built with the given letters
        // Starts off true, and the algorithm (loop) can set it to false.
        let mut this_word_matches;
        // Used to index into each letter of the dictionary word
        let mut dictionary_word_pointer;
        // Used to index into each letter of the letters-set
        let mut find_word_pointer;
        // Check each word in the dictionary and compare it with the letters
        // to see if the dictionary word can be build with a portion of,
        // or all of, the provided letters.
        for word in self.all_words.iter() {
            // Re-Initialize the pointers and flags for each word processed
            this_word_matches = true;
            dictionary_word_pointer = 0;
            find_word_pointer = 0;
            // Each dictionary word has already been pre-sorted. Just need to access it.
            let sorted_dictionary_word = &self.to_sorted[word];

            // Compare each letter of both words
            while dictionary_word_pointer < sorted_dictionary_word.len() {
                // Letter of the dictionary word
                let dictionary_letter =
                    sorted_dictionary_word[dictionary_word_pointer];
                // Letter of the "find-word" (of the given letters-set)
                let partial_letter = letters_to_find[find_word_pointer];
                // If both letters match, then we're making progress and this
                // dictionary word is one step closer to being a match
                if dictionary_letter == partial_letter {
                    dictionary_word_pointer += 1;
                }
                // Regardless whether the two letters matched, the find-word letter
                // will always advance
                find_word_pointer += 1;

                // If we run out of letters in the letters-set before getting through
                // all the letters of the dictionary word, then the word could not be
                // build with the letters-set. It's not a match.
                if find_word_pointer >= number_of_letters_to_find
                    && dictionary_word_pointer < sorted_dictionary_word.len()
                {
                    // This word cannot be built from the given letters
                    this_word_matches = false;
                    break;
                }
            }

            if this_word_matches {
                matching_words.push(word.to_owned());
            }
        }

        matching_words
    }

    ///
    /// Returns all of the dictionary words of the given length
    pub fn get_all_words_of_length(
        &self,
        number_of_characters: usize,
    ) -> Option<&Vec<String>> {
        // All the words that have the correct number of characters
        self.by_length.get(&number_of_characters)
    }
}
