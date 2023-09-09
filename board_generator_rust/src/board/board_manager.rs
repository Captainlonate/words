use itertools::Itertools;

use super::cell_contents::CellContents;
use super::direction::{get_opposite_direction, Direction};
use super::placed_word::{PlacedWord, PlacedWordCell, PossibleWordLocation};
use crate::generator::{WordLocationOnBoard, WordLocationsOnBoard};
use crate::utils::{all_indicies_of, shuffle};
use std::collections::HashMap;

const EMPTY_CELL_VALUE: char = '#';

#[derive(Debug, Default)]
pub struct BoardManager {
    /// Represents the conceptual width and height of the grid (board).
    /// This translates to the number of rows and columns in a 2d array.
    pub dimensions: usize,
    /// Keeps track of all the words that have been placed on the board
    /// at any given time. It can quickly help us answer questions such as
    /// "has this word been placed yet", and if so "where is it and in which
    /// direction is it placed".
    words_placed: HashMap<String, PlacedWord>,
    /// A 2d vector. Conceptually it represents "the board".
    grid: Vec<Vec<CellContents>>,
}

/**
 * Static Methods
 */
impl BoardManager {
    /// Constructor to generate a new BoardManager
    pub fn new() -> Self {
        Self::default()
    }
}

/**
 * Instance Methods
 */
impl BoardManager {
    ///
    /// Initialize an existing BoardManager with a new
    /// word list. This will also reset any previous state
    /// attached to the BoardManager
    ///
    pub fn new_list(&mut self, dimensions: usize) {
        let default_cell = CellContents {
            letter: EMPTY_CELL_VALUE,
            is_used_horizontally: false,
            is_used_vertically: false,
            is_empty: true,
        };

        self.dimensions = dimensions;
        self.grid = vec![vec![default_cell; dimensions]; dimensions];
    }

    ///
    /// Returns the PlacedWord objects for each word currently
    /// placed on the board/grid.
    ///
    pub fn get_used_word_objects(&self) -> Vec<PlacedWord> {
        let mut used_words: Vec<PlacedWord> = Vec::new();
        for word_obj in self.words_placed.values() {
            used_words.push(word_obj.clone());
        }
        used_words
    }

    ///
    /// Returns only the words that have been placed on
    /// the board/grid. These are just the words, not the
    /// objects.
    ///
    pub fn get_used_words(&self) -> Vec<String> {
        let mut used_words: Vec<String> = Vec::new();
        for word in &self.words_placed {
            used_words.push(word.0.clone());
        }
        used_words
    }

    pub fn get_placed_words_for_serialization(&self) -> WordLocationsOnBoard {
        let mut word_locations: WordLocationsOnBoard = HashMap::new();
        for word in &self.words_placed {
            word_locations.insert(
                word.0.to_string(),
                WordLocationOnBoard {
                    row: word.1.cells[0].row,
                    col: word.1.cells[0].col,
                    direction: word.1.direction,
                },
            );
        }
        word_locations
    }

    ///
    /// Returns how many words have been placed on the board.
    ///
    pub fn get_number_of_used_words(&self) -> usize {
        self.words_placed.len()
    }

    ///
    /// The grid is a 2D Vector of objects and this method
    /// will squash the entire 2D Vector into a single string,
    /// extracting only the letters of each CellContents object,
    /// and then separate eaching row-substring with a "_"
    ///
    /// Example
    /// ```
    /// [
    ///   ['a', 'b', 'c'],
    ///   ['d', 'e', '#'],
    ///   ['g', 'h', 'i'],
    /// ]
    ///
    /// // Will yield
    /// "abc_de#_ghi"
    /// ```
    ///
    pub fn get_grid_str(&self) -> String {
        // TODO: Need to crop this to shave off unneeded
        // rows and columns
        self.grid
            .iter()
            .map(|row| {
                row.iter()
                    .map(|cell_contents| cell_contents.letter)
                    .join("")
            })
            .join("_")
    }

    ///
    /// Resets the board (the grid) to it's default state
    /// and "forgets" any words that have been placed.
    ///
    pub fn clear_board(&mut self) {
        self.words_placed = HashMap::new();

        let default_cell = CellContents {
            letter: EMPTY_CELL_VALUE,
            is_used_horizontally: false,
            is_used_vertically: false,
            is_empty: true,
        };

        self.grid = vec![vec![default_cell; self.dimensions]; self.dimensions];
    }

    ///
    /// Place a word on the board (in the grid).
    ///
    pub fn place_word(
        &mut self,
        word: &str,
        start_row: usize,
        start_col: usize,
        direction: Direction,
    ) {
        // Make sure it hasn't been used yet
        if self.words_placed.contains_key(word) {
            println!("'{word}' word has been used already");
            return;
        }

        // Ensure the word fits within the dimensions
        // of the board
        let overflows_h = start_col + word.len() > self.dimensions;
        let overflows_v = start_row + word.len() > self.dimensions;
        if (direction == Direction::H && overflows_h)
            || (direction == Direction::V && overflows_v)
        {
            println!("'{word}' word does not fit on the board");
            return;
        }

        let mut cells: Vec<PlacedWordCell> = Vec::new();

        for (offset_idx, letter) in word.chars().enumerate() {
            match direction {
                Direction::H => {
                    let row = start_row;
                    let col = start_col + offset_idx;
                    cells.push(PlacedWordCell {
                        row,
                        col,
                        letter,
                        direction: Direction::H,
                    });
                    self.grid[row][col].letter = letter;
                    self.grid[row][col].is_empty = false;
                    self.grid[row][col].is_used_horizontally = true;
                }
                Direction::V => {
                    let row = start_row + offset_idx;
                    let col = start_col;
                    cells.push(PlacedWordCell {
                        row,
                        col,
                        letter,
                        direction: Direction::V,
                    });
                    self.grid[row][col].letter = letter;
                    self.grid[row][col].is_empty = false;
                    self.grid[row][col].is_used_vertically = true;
                }
            }
        }

        // This word is now considered a "used word".
        // It's been placed on the grid already.
        self.words_placed.insert(
            String::from(word),
            PlacedWord {
                cells,
                direction,
                word: String::from(word),
            },
        );
    }

    ///
    /// Remove a word from the board (from the grid).
    /// Two objectives:
    ///   1) Remove the word from the `words_placed` hashmap
    ///   2) Maybe remove the letters from the board as long as they
    ///     aren't also used by another placed word on the board.
    ///
    pub fn remove_word_from_board(&mut self, word_to_remove: &str) {
        if let Some(placed_word) = self.words_placed.get(word_to_remove) {
            for cell in placed_word.cells.iter() {
                // If this cell is also used in the cross direction,
                // then it must be being used by two words.
                if cell.direction == Direction::H {
                    self.grid[cell.row][cell.col].is_used_horizontally = false;
                    if !self.grid[cell.row][cell.col].is_used_vertically {
                        self.grid[cell.row][cell.col].is_empty = true;
                        self.grid[cell.row][cell.col].letter = EMPTY_CELL_VALUE;
                    }
                } else {
                    self.grid[cell.row][cell.col].is_used_vertically = false;
                    if !self.grid[cell.row][cell.col].is_used_horizontally {
                        self.grid[cell.row][cell.col].is_empty = true;
                        self.grid[cell.row][cell.col].letter = EMPTY_CELL_VALUE;
                    }
                }
            }
        }

        self.words_placed.remove(word_to_remove);
    }

    ///
    /// During this part of the algorithm, I'm considering
    /// a word while looking at the board, and trying to find
    /// possible places where I could validly place the word.
    /// Each word is placed over another already-placed word.
    ///
    /// __Example of placing "mage":__
    /// ```
    ///    0 1
    ///  0   m
    ///  1 w a r r i o r
    ///  2   g
    ///  3   e
    /// ```
    ///
    /// In this example, the word "mage" can only be placed
    /// on the board in one valid location; by using the 'a'
    /// in "warrior", and by placing "mage" vertically.
    /// I would say that I've placed the word by "laying it
    /// over the already-placed letter 'a'".
    /// So in that case:
    /// ```
    /// PossibleWordLocation {
    ///   start_row: 0,
    ///   start_col: 1,
    ///   word: String::from("mage"),
    ///   direction: Direction::V
    /// }
    /// ```
    /// Finally, to add randomness to the board, we may
    /// want to find all of the possible locations for a word,
    /// and randomly pick which one to use. However, when done
    /// tens of thousands of times, it can be extremely expensive.
    /// This is why it's possible to pass in `max_locations_to_find`.
    ///
    /// * `word_to_place` - Which word you are trying to place on the board.
    /// * `max_locations_to_find` - Put a limit on the number of locations
    /// that this will try to find. The lower the limit, the better the
    /// performance, but the less "randomness" you can achieve.
    ///
    pub fn find_some_locations_for_word(
        &mut self,
        word_to_place: &str,
        max_locations_to_find: usize,
    ) -> Vec<PossibleWordLocation> {
        // Find all the cells (letters) that have already been placed on the board,
        // and whose letter is found within the word we're trying to place.
        // This gives us a list of potential cells over which we can lay
        // the word we're trying to place. So, if there's an 'e' on the board,
        // and we're trying to play "every", then the 'e' would have two
        // matching indices [0, 2]
        let all_used_cells: Vec<(PlacedWordCell, Vec<usize>)> = self
            .words_placed
            .iter()
            .flat_map(|p| p.1.cells.clone())
            .filter_map(|cell| {
                let indicies = all_indicies_of(word_to_place, cell.letter);
                if indicies.is_empty() {
                    None
                } else {
                    Some((cell, indicies))
                }
            })
            .collect();

        // Mix up the order that we evaluate each cell. This helps add randomness to
        // the generated board. If you could place the word 'every' in 6 different locations,
        // then we don't want to always "try" the same location, given the same board.
        let shuffled_cells = shuffle(&all_used_cells);

        // This is where most of the evaluation logic is held. The idea is that
        // we want to try to lay the word over the already placed letter on the board,
        // and then check the surrounding cells to see if it's "ok" to lay the word there.
        // For instance, you can't have two words side-by-side in the same direction,
        // and the final letter has to have an empty cell after it.
        let mut possible_locations: Vec<PossibleWordLocation> = vec![];
        for (cell, indicies) in shuffled_cells.iter() {
            // Each of these is an index of the word_to_place where we can lay
            // the word over the letter on the board. If 'e', is the third letter
            // of the word, then we need to start placing it two cells up so that the
            // 'e' will intersect.
            for anchor_idx in indicies.iter() {
                // The letter on the board is currently used in one direction.
                // We will try to place the word in the opposite direction.
                let opposite_direction =
                    get_opposite_direction(&cell.direction);

                // TODO - Need to handle the usize subtraction better
                let start_row;
                let start_col;
                match opposite_direction {
                    Direction::H => {
                        if (cell.col as i32 - *anchor_idx as i32) < 0 {
                            continue;
                        } else {
                            start_row = cell.row;
                            start_col = cell.col - anchor_idx
                        }
                    }
                    Direction::V => {
                        if (cell.row as i32 - *anchor_idx as i32) < 0 {
                            continue;
                        } else {
                            start_row = cell.row - anchor_idx;
                            start_col = cell.col
                        }
                    }
                };

                // Check that the cell adjacent to the starting position is empty.
                // If moving horizontally, then it's the cell to the left
                // If moving vertically, then it's the cell above the starting cell.
                let left_cell_not_used: bool = start_col == 0
                    || !self.cell_is_used(start_row, start_col - 1);
                let above_cell_not_used: bool = start_row == 0
                    || !self.cell_is_used(start_row - 1, start_col);
                if (opposite_direction == Direction::H && !left_cell_not_used)
                    || (opposite_direction == Direction::V
                        && !above_cell_not_used)
                {
                    // Continue to the next way that this word can be placed
                    // on this specific letter
                    continue;
                }

                //
                // TODO: BUG
                //
                // MISE & MISES CAN BOTH BE OVERLAPPED
                // HORIZONTALLY.
                //
                // WHICH ONE WAS PLACED FIRST???
                //
                // CANNOT HAVE TWO CONSECUTIVE CELLS OCCUPIED, IN
                // THE SAME DIRECTION.
                //
                // TWO CONSECUTIVE CELLS OCCUPIED IN SAME DIRECTION
                // WOULD IMPLY THAT WE HAD TWO PARALLEL
                // WORDS SIDE-BY-SIDE (WHICH CAN'T HAPPEN).
                //
                // IF CELL IS OCCUPIED, CHECK NEXT CELL IN SAME
                // DIRECTION. IF ALSO OCCUPIED, BREAK.
                //
                //

                // Go through each of the letters of the word to place. Pretend to place
                // the letter on the board and see if it looks like it would fit there.
                for (letter_idx, letter) in word_to_place.chars().enumerate() {
                    // If it's the last letter of the word to place
                    // then there are additional checks we must do.
                    let is_last_letter = letter_idx == word_to_place.len() - 1;

                    // Determine the indicies of the current letter we're trying to place
                    let (current_row, current_col) = match opposite_direction {
                        Direction::H => (start_row, start_col + letter_idx),
                        Direction::V => (start_row + letter_idx, start_col),
                    };

                    // Make sure the indicies are valid and correspond to
                    // a cell on the board. Then fetch that cell's contents.
                    let current_cell_option =
                        self.get_cell_at(current_row, current_col);
                    if current_cell_option.is_none() {
                        continue;
                    }
                    let current_cell = current_cell_option.unwrap();

                    // It might match because it's used in a different word
                    // Or, it could match because it's the match index that we were expecting.
                    let letter_is_already_on_board =
                        current_cell.letter == letter;

                    // If this is the last cell in the word, then the next
                    // cell must be empty.
                    let passes_last_cell_check = match opposite_direction {
                        Direction::H => {
                            !is_last_letter
                                || !self.cell_is_used(
                                    start_row,
                                    start_col + letter_idx + 1,
                                )
                        }
                        Direction::V => {
                            !is_last_letter
                                || !self.cell_is_used(
                                    start_row + letter_idx + 1,
                                    start_col,
                                )
                        }
                    };

                    // Check the adjacent cells to ensure they are empty.
                    // Which cells you check is determined by which direction
                    // you are placing the word.
                    // Trying to avoid placing two words, side-by-side, parallel.
                    let above_is_empty = start_row == 0
                        || !self.cell_is_used(
                            start_row - 1,
                            start_col + letter_idx,
                        );
                    let below_is_empty = !self
                        .cell_is_used(start_row + 1, start_col + letter_idx);
                    let left_is_empty = start_col == 0
                        || !self.cell_is_used(
                            start_row + letter_idx,
                            start_col - 1,
                        );
                    let right_is_empty = !self
                        .cell_is_used(start_row + letter_idx, start_col + 1);
                    let adjacent_cells_are_empty = match opposite_direction {
                        Direction::H => above_is_empty && below_is_empty,
                        Direction::V => left_is_empty && right_is_empty,
                    };

                    //
                    let cell_is_available = current_row < self.dimensions
                        && current_col < self.dimensions
                        && passes_last_cell_check
                        && (letter_is_already_on_board
                            || (current_cell.is_empty
                                && adjacent_cells_are_empty));

                    //
                    if !cell_is_available {
                        break;
                    }

                    //
                    if letter_idx == word_to_place.len() - 1 {
                        // All cells were valid, this is a valid position
                        // The word can be placed over this letter by starting
                        // at the starting cell and going in the opposite direction.
                        possible_locations.push(PossibleWordLocation {
                            start_row,
                            start_col,
                            word: word_to_place.to_string(),
                            direction: opposite_direction,
                        });
                        if possible_locations.len() >= max_locations_to_find {
                            return possible_locations;
                        }
                    }
                }
            }
        }

        possible_locations
    }

    ///
    /// Get the contents of one cell of the board.
    ///
    pub fn get_cell_at(
        &self,
        row_idx: usize,
        col_idx: usize,
    ) -> Option<CellContents> {
        if row_idx < self.grid.len() && col_idx < self.grid[row_idx].len() {
            Some(self.grid[row_idx][col_idx].clone())
        } else {
            None
        }
    }

    ///
    /// Check if a cell contains a letter, or if it's empty.
    ///
    pub fn cell_is_used(&self, row_idx: usize, col_idx: usize) -> bool {
        // Make sure row and col are valid indexes
        if row_idx < self.grid.len() && col_idx < self.grid[row_idx].len() {
            return !self.grid[row_idx][col_idx].is_empty;
        }
        false
    }

    ///
    /// Print some debugging information about the BoardManager
    /// to the console.
    ///
    pub fn debug(&self) {
        let words_used = self.get_used_words();

        println!("---- Board Manager ----");

        let mut board_string = String::new();

        // Build the column titles
        board_string.push_str("  ");
        let column_titles = (0..self.dimensions)
            .map(|n| (n % 10).to_string())
            .collect::<Vec<String>>()
            .join(" ");
        board_string.push_str(&format!("{column_titles}\n"));

        // Render each row
        for (row_idx, row) in self.grid.iter().enumerate() {
            board_string.push_str(&(row_idx % 10).to_string());
            board_string.push(' ');
            for cell in row.iter() {
                if cell.letter == EMPTY_CELL_VALUE {
                    board_string.push(' ');
                } else {
                    board_string.push(cell.letter);
                }
                board_string.push(' ');
            }
            board_string.push('\n');
        }
        println!("{board_string}");

        println!("Dimensions: {0}x{0}", self.dimensions);

        println!("@@@ USED ({}) @@@", words_used.len());
        println!("{words_used:?}");

        println!("-----------------------");
    }
}
