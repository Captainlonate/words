pub mod board;
pub mod cli;
pub mod config;
pub mod dictionary;
pub mod generator;
pub mod utils;

use clap::Parser;
use cli::RunMode;
use colored::Colorize;
use config::Config;
use dictionary::DictionaryManager;
use generator::{try_to_generate_a_board, GeneratedBoard};
use std::{
    collections::HashMap,
    fs::{self},
    time::Instant,
};

fn main() {
    let all_config = config::Config::default();

    match cli::Args::parse().mode {
        // --mode files
        Some(RunMode::Files) => {
            println!("Processing New Dictionary Files.");
            dictionary::create_all_dictionary_files(&all_config);
        }
        // --mode generate
        Some(RunMode::Generate) => {
            println!("Generating using precomputed words.");
            generate_boards(&all_config);
        }
        None => {
            println!("Error: Pass --mode <files | generate>");
        }
    }
}

fn generate_boards(all_config: &Config) {
    //
    // Create a dictionary manager
    // Load the dictionary file, parse the words.
    let mut dictionary = DictionaryManager::new();

    dictionary.load_precomputed_dictionary();

    let mut generated_boards: Vec<GeneratedBoard> = Vec::new();
    let mut times_map: HashMap<u128, usize> = HashMap::new();
    let time_all_boards = Instant::now();
    let mut failed_attempts: usize = 0;

    //
    // Generate the number of boards set in the config.
    // For each board, make a note of how long (in ms) it took to generate.
    // This will tell us how many boards took 1ms to generate, vs 5ms.
    while generated_boards.len() < all_config.app.number_of_boards {
        let time_per_board = Instant::now();

        match try_to_generate_a_board(
            &dictionary,
            all_config,
        ) {
            Some(new_board) => {
                *times_map
                    .entry(time_per_board.elapsed().as_millis())
                    .or_insert(0) += 1;
                generated_boards.push(new_board);
                if generated_boards.len() % 100 == 0 {
                    println!(
                        "{} / {} boards",
                        generated_boards.len(),
                        all_config.app.number_of_boards
                    );
                }
            }
            None => {
                failed_attempts += 1;
            }
        }
    }

    // This is the total amount of time it took to generate all boards combined.
    let total_elapsed_time = time_all_boards.elapsed().as_millis();

    if all_config.app.should_log_times {
        let blank_line = "                                       ".on_cyan();
        println!("{blank_line}");
        println!("{}", "                Summary                ".on_cyan());
        println!("{blank_line}");
        println!("{}", "Total Time:".bold());
        println!(
            "It took {}ms to generate {} boards.",
            total_elapsed_time.to_string().green(),
            all_config.app.number_of_boards.to_string().green(),
        );
        println!("{blank_line}");
        println!("{}", "Time Each Board:".bold());
        println!("Generation Times (ms: frequency)\n{times_map:#?}");
        println!("{blank_line}");
        println!("Failed Attempts: {failed_attempts}");
        println!("{blank_line}\n{blank_line}");
    }

    //
    if let Ok(json_to_write) = serde_json::to_string(&generated_boards) {
        fs::write("./boards.json", json_to_write)
            .expect("Could not write the boards to a file.");
    }
}
