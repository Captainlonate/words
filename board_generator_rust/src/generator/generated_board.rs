use std::collections::HashMap;

use serde::Serialize;

use crate::board::Direction;

///
/// Because the purpose of this struct is for serialization
/// I've abbreviated the field names for a smaller payload
/// size
///
#[derive(Debug, Clone, Serialize)]
pub struct WordLocationOnBoard {
    /// row index
    #[serde(rename(serialize = "r"))]
    pub row: usize,
    /// column index
    #[serde(rename(serialize = "c"))]
    pub col: usize,
    /// direction
    #[serde(rename(serialize = "d"))]
    pub direction: Direction,
}

pub type WordLocationsOnBoard = HashMap<String, WordLocationOnBoard>;

#[derive(Clone, Debug, Serialize)]
pub struct GeneratedBoard {
    // The completed board/grid
    pub grid: String,
    // All of the words that were used on the grid
    pub used: WordLocationsOnBoard,
    // All of the words capable of being built from
    // the letters
    pub all: String,
    // The letters used to generate the board
    pub letters: String,
}
