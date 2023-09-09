use rand::Rng;
use serde::Serialize;

///
/// Each word on the board (and each corresponding letter
/// of each word) is placed in a direction. The word can be
/// placed horizontally (from left to right), or vertically
/// (from top to bottom).
///
#[derive(Clone, Debug, PartialEq, Eq, Copy, Serialize)]
pub enum Direction {
    /// Direction::H -> Horizontal
    H,
    /// Direction::V -> Vertical
    V,
}

///
/// It's necessary to know the opposite direction throughout
/// the algorithm. For instance, if a letter is used in a
/// word that is placed horizontally, and we want to place
/// another word over that letter (to create a cross-word),
/// then we can flip the direction using this utility.
///
pub fn get_opposite_direction(direction: &Direction) -> Direction {
    match direction {
        Direction::H => Direction::V,
        Direction::V => Direction::H,
    }
}

///
/// This utility will randomly choose either Horizontal
/// or vertical. That's self explanatory, but the reason
/// you'd want this is because when you place the very
/// first word on the board (the initial seven letter word),
/// you want to add a bit of "randomness" to it. Changing the
/// direction of the initial word can make the board "look"
/// much different.
///
pub fn get_random_direction() -> Direction {
    let mut rng = rand::thread_rng();
    if rng.gen::<f64>() > 0.5 {
        Direction::H
    } else {
        Direction::V
    }
}
