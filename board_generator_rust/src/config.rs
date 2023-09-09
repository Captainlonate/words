#[derive(Clone, Debug)]
pub struct AppConfig {
    /// After generating the boards, should the boards be
    /// written to an output file. If So, which file.
    pub should_output_to_file: bool,
    pub output_filepath: String,
    /// Paths to the different dictionary files to read in
    pub base_dictionary_filepath: String,
    pub clean_dictionary_filepath: String,
    pub precomputed_words_filepath: String,
    /// Which "bad words dictionary" file to read in.
    pub bad_words_filepath: String,
    /// How many boards should be generated.
    pub number_of_boards: usize,
    /// After running, should the app console.log out how long
    /// each board took to run, in an aggregated format.
    pub should_log_times: bool,
}

#[derive(Clone, Debug)]
pub struct GeneratorConfig {
    /// The exact number of words to place is calculated based on the number
    /// of available words. However, this is the maximum number of
    /// words that can be placed regardless, for performance reasons.
    pub max_words_to_place: usize,
    /// We don't want to spend too much time trying to place a word.
    /// Generally building a board is a straight shot, requiring very
    /// little retries.
    pub max_attempts_before_giving_up: usize,
    /// Even though the letters might be capable of creating
    /// 100's of words, for performance reasons we can't
    /// try to place all of them, for each locations of each word,
    /// recursively. So we cap the number of possible words to consider.
    pub max_words_to_consider: usize,
    /// The maximum width (columns) and height (rows) that a board
    /// can be. At the end  of generating a board, the board will
    /// be cropped down to it's "used" dimensions. These dimension
    /// constrain the board during generation and prevent super
    /// wide or tall chains from occurring. This is how we ensure
    /// boards are mostly square.
    pub board_dimensions: usize,
    /// The minimum number of words that must be able to be constructed
    /// from the starting letters. No point in trying to build a board
    /// if the letters can only make 5 words.
    /// This is the minimum number of words required to
    /// make it into the precomputed word file.
    pub min_words_to_consider_letters: usize,
    /// For each board that is generated, should information
    /// about that board be console.logged.
    pub should_log_board_info: bool,
}

#[derive(Clone, Debug)]
pub struct Config {
    pub app: AppConfig,
    pub generator: GeneratorConfig,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            app: AppConfig {
                should_output_to_file: true,
                output_filepath: String::from("./boards.json"),
                base_dictionary_filepath: String::from(
                    "./dictionary_files/84000_gwicks.txt",
                ),
                clean_dictionary_filepath: String::from(
                    "./dictionary_files/clean_dictionary.txt",
                ),
                bad_words_filepath: String::from(
                    "./dictionary_files/bad_words_to_exclude.txt",
                ),
                precomputed_words_filepath: String::from(
                    "./dictionary_files/precomputed_words.json",
                ),
                // How many boards to generate
                // The precomputed algorithm becomes incomparably faster shortly after that.
                // Technically the pre-computed IS faster per board always, but requires a longer
                // "boot up" time due to loading some files.
                // At 1 board: on-the-fly is 20 milliseconds, and pre-computed is 40 milliseconds
                // At 15 boards, they are both at about 37 milliseconds.
                // At 1,000 boards: on-the-fly = 1.2 seconds, and pre-computed = 155 milliseconds
                // At 10,000 boards, on-the-fly is 12 seconds, and pre-computed is 1 sec.
                number_of_boards: 10_000,
                // number_of_boards: 1,
                should_log_times: true,
            },
            generator: GeneratorConfig {
                max_words_to_place: 20,
                // max_words_to_place: 17,
                max_attempts_before_giving_up: 50,
                max_words_to_consider: 40,
                // board_dimensions: 17,
                board_dimensions: 11,
                min_words_to_consider_letters: 16,
                // Don't log board info if you have a bunch of boards
                should_log_board_info: false,
                // should_log_board_info: true,
            },
        }
    }
}
