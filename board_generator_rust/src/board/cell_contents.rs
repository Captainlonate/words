///
/// Each cell of the board (of the grid) will contain
/// one of these objects. Rather than just store the
/// letter (char) in the grid, it's helpful (and performant)
/// to also keep track of how each letter/cell is used.
/// If we set the flag `is_used_horizontally`: true when
/// we add a word, it can help us later when we try to remove
/// the word
///
#[derive(Clone, Debug)]
pub struct CellContents {
    pub letter: char,
    pub is_used_horizontally: bool,
    pub is_used_vertically: bool,
    pub is_empty: bool,
}
