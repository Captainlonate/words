use crate::board::{get_random_direction, BoardManager, Direction};
use crate::config::Config;
use crate::dictionary::DictionaryManager;
use crate::utils::*;
use itertools::Itertools;
use std::cmp::min;

use super::GeneratedBoard;

///
/// This is sort of the "starting point" for generating a new board.
/// It contains all of the flow and primary logic for generating a
/// board, but it does rely on some other classes for managing state
/// and doing word comparisons and board traversals.
///
pub fn try_to_generate_a_board(
    dictionary: &DictionaryManager,
    all_config: &Config,
) -> Option<GeneratedBoard> {
    // =====================================================
    //  DETERMINE FIRST WORD, LETTERS-SET, AND POSSIBLE WORDS
    // =====================================================

    // New Algorithm - Use the precomputed values
    // let starting_tuple = dictionary.get_random_starting_word()?;
    let orig_starting_tuple = dictionary.get_random_starting_word()?.to_owned();
    let mut starting_tuple: (String, Vec<String>) = (orig_starting_tuple.0.to_owned(), orig_starting_tuple.1.to_owned());
    starting_tuple.1.retain(|x| x == "mise" || x == "mises");
    let random_seven_letter_word: String = starting_tuple.0.to_string();
    let all_possible_words: Vec<String> = starting_tuple.1.to_owned();

    // =====================================================
    //  RANDOMIZE ALL POSSIBLE WORDS THAT CAN BE PLACED
    // =====================================================

    // Too many possible words makes the algorithm slow.
    // So, put a cap on the number of words added to the pool.
    let initial_words_shuffled: Vec<String> = shuffle(&all_possible_words)
        .into_iter()
        .take(all_config.generator.max_words_to_consider)
        .collect();

    // =====================================================
    //  PLACE THE FIRST WORD ON THE BOARD
    // =====================================================

    let board_dimensions = all_config.generator.board_dimensions;
    let mut bm = BoardManager::new();
    bm.new_list(all_config.generator.board_dimensions);
    let initial_direction = get_random_direction();
    let center_base = board_dimensions / 2;
    let (center_row, center_col) = match initial_direction {
        Direction::H => {
            (center_base, center_base - random_seven_letter_word.len() / 2)
        }
        Direction::V => {
            (center_base - random_seven_letter_word.len() / 2, center_base)
        }
    };

    // =======================================================
    //  DETERMINE HOW MANY WORDS NEED TO BE PLACED ON THE BOARD
    // =======================================================

    // Calculate desired number of words that must be placed
    // based on how many possible words there are. The random number
    // adds some variation, since it could be very common to always
    // end up with the same "max" number of words.
    // * get_random_float_in_range(0.55, 0.8))
    // let desired_words_count = (initial_words_shuffled.len() as f32
    //     * get_random_float_in_range(0.50, 0.8))
    // .round();
    let desired_words_count = initial_words_shuffled.len() + 1;
    // Set a maximum number of words to place on the board
    let capped_words_count: usize = get_random_int_in_range(
        all_config.generator.max_words_to_place - 3,
        all_config.generator.max_words_to_place,
    );
    let minimum_words_count =
        min(desired_words_count as usize, capped_words_count);

    // =====================================================
    //  BEGIN TRYING ALL POSSIBLE WORD COMBINATIONS UNTIL THE
    //  MINIMUM NUMBER OF WORDS HAS BEEN PLACED.
    // =====================================================

    // I've determined it's more effective to give up early and just
    // try a new word, than to commit to an unlucky wordlist.
    // This counter will indicate when we've spent "too much time"
    // trying to arrange a given wordlist. Each "attempt" corresponds
    // to a single "permutation" of the words list.
    let mut attempts = 0;

    // This will calculate a single permutation of the words-pool for each
    // "attempt" at creating a board. I use an iterator to grab a new one
    // as I go, but certainly not try to generate ALL permutations up front,
    // which I think is computationally impossible when we're dealing with
    // sets of 20-30 elements (Eg: check out what 20 factorial equals)
    let permutations = initial_words_shuffled
        .iter()
        .permutations(initial_words_shuffled.len());

    // Flag indicates whether or not this attempt at generating a board
    // was successful. Sometimes it happens that given the set of words,
    // it's just not possible to arrange enough of them together for a board
    // to be considered "good enough".
    let mut succeeded = false;

    // This loop contains most of the flow and algorithmic logic for
    // generating a board. It outlines the steps necessary to
    // make a board, while some of the other classes implement the specific
    // details on how to search a grid, or find possible locations.
    for words_in_this_permutation in permutations {
        attempts += 1;
        if attempts > all_config.generator.max_attempts_before_giving_up {
            // println!("Failed - Breaking from too many attempts.");
            break;
        }

        // Every time we try out a new word-list (permutation), we need
        // to reset the board to the starting state. Which is an empty
        // board with only the initial seven-letter word placed in the center.
        bm.clear_board();
        bm.place_word(
            &random_seven_letter_word,
            center_row,
            center_col,
            initial_direction,
        );

        // Iterate through each of the words in the words-list (one permutation),
        // then try to place it somewhere on the board (if there even is a valid
        // location for it). Then move to the next word, repeat.
        // Eventually we'll either place enough words (success state),
        // or we'll run out of words (failure state)
        for word in words_in_this_permutation {
            // Check to see if there are any valid spots on the board
            // where we can place this word. It's possible that there aren't,
            // and I've accounted for a few failures by generally making
            // sure there is an excess of available words in the permutation.
            // If the permutation list had the EXACT number of words we must place,
            // then we'd be able to break immediately when a word isn't placeable.
            // For performance reasons I'm limiting the number of possible locations
            // to only 1. I could add more randomness by trying ALL possible locations,
            // but it negatively impacts the speed.
            // let locations_for_this_word =
            //     bm.find_some_locations_for_word(word, 1);
            let locations_for_this_word =
                bm.find_some_locations_for_word(word, 20);
            
            // println!("Matches = {:#?}", locations_for_this_word);

            if !locations_for_this_word.is_empty() {
                // Again, I'm just taking the first (and only) location, but
                // I could fetch and try all of them. However, it'd require
                // some back-stepping to undo a location when it doesn't work.
                let one_location = &locations_for_this_word[0];
                bm.place_word(
                    word,
                    one_location.start_row,
                    one_location.start_col,
                    one_location.direction,
                );

                // We've been able to place enough words on the board using
                // this permutation.
                if bm.get_number_of_used_words() >= minimum_words_count {
                    succeeded = true;
                    break;
                }
            }
        }

        // Since we're already in the success state, no need to consider
        // any more permuations. Stop the entire algorithm.
        if succeeded {
            break;
        }
    }

    // ==========================
    //  LOG THE RESULTS
    // ==========================
    if all_config.generator.should_log_board_info {
        println!("---RESULTS----");
        bm.debug();
        println!("Randomly chosen word: '{random_seven_letter_word}'");
        println!(
            "Targeted {} out of {} selected words. ({} total)",
            minimum_words_count,
            initial_words_shuffled.len(),
            all_possible_words.len()
        );
        println!("Total Attempts: {attempts}");
        println!("Was successful? {succeeded}");
        println!("--------------");
    }

    if succeeded {
        Some(GeneratedBoard {
            grid: bm.get_grid_str(),
            used: bm.get_placed_words_for_serialization(),
            all: all_possible_words.join("_"),
            letters: random_seven_letter_word,
        })
    } else {
        None
    }
}
