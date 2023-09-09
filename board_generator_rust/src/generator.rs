mod generate_board;
mod generated_board;

pub use generate_board::try_to_generate_a_board;
pub use generated_board::{
    GeneratedBoard, WordLocationOnBoard, WordLocationsOnBoard,
};
