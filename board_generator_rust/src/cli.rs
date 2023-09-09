use clap::{Parser, ValueEnum};

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
pub struct Args {
    /// The utility can run in one of many modes.
    #[arg(short, long, value_enum)]
    pub mode: Option<RunMode>,
}

#[derive(
    Parser, Debug, Copy, Clone, PartialEq, Eq, PartialOrd, Ord, ValueEnum,
)]
pub enum RunMode {
    /// Generate a new clean dictionary file and precomputed dictionary file from the base and bad-words files. This mode will not generate any boards.
    Files,
    /// Generate boards. Use the pre-computed word file. Extremely fast for large numbers of boards.
    Generate,
}
