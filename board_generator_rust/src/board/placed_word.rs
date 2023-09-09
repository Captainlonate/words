use super::direction::Direction;

///
/// Represents one valid location on the board
/// where a word could be placed.
///
#[derive(Clone, Debug)]
pub struct PossibleWordLocation {
    pub start_row: usize,
    pub start_col: usize,
    pub word: String,
    pub direction: Direction,
}

///
/// When a word is placed on the board, I map that
/// word to a bunch of these `PlacedWordCell`s.
/// There is one for each letter of the word
///
#[derive(Clone, Debug)]
pub struct PlacedWordCell {
    /// The row index within the 2d grid
    pub row: usize,
    /// The column index within the 2d grid
    pub col: usize,
    pub letter: char,
    pub direction: Direction,
}

///
/// When a word is placed on the board, it's stored
/// in a couple of different ways (some ways are better
/// for querying or iteration than others). One of the ways
/// is in a HashMap that makes it easy to see which words are
/// placed, and for each of them, what direction is it in
/// and which cells are used.
///
#[derive(Clone, Debug)]
pub struct PlacedWord {
    /// All words are written either from left to right,
    /// or from top to bottom.
    pub direction: Direction,
    pub word: String,
    pub cells: Vec<PlacedWordCell>,
}
