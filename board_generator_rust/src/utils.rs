use rand::{seq::SliceRandom, thread_rng, Rng};

pub fn get_random_int_in_range(min_num: usize, max_num: usize) -> usize {
    let mut rng = rand::thread_rng();
    rng.gen_range(min_num..max_num)
}

pub fn get_random_float_in_range(min_num: f32, max_num: f32) -> f32 {
    let mut rng = rand::thread_rng();
    rng.gen_range(min_num..max_num)
}

///
/// Finds all of the indexes where the letter appears
/// within the word.
///
/// Example:
/// ```
/// // vec![1, 4]
/// let indicies: Vec<usize> = all_indicies_of("nathan", 'a');
/// ```
///
pub fn all_indicies_of(word: &str, letter_to_find: char) -> Vec<usize> {
    let mut indicies: Vec<usize> = Vec::new();
    for (idx, letter_in_word) in word.chars().enumerate() {
        if letter_in_word == letter_to_find {
            indicies.push(idx);
        }
    }
    indicies
}

///
/// Randomizes the order of the elements of a vector.
///
/// Example
/// ```
/// let items = vec!["1", "2", "3", "4"];
/// // Might result in vec!["2", "4", "1", "3"]
/// let shuffled_items_1 = shuffle(&items);
/// // Might result in vec!["4", "2", "3", "1"]
/// let shuffled_items_2 = shuffle(&items);
/// ```
///
pub fn shuffle<T: std::clone::Clone>(list: &[T]) -> Vec<T> {
    let mut shuffled_list: Vec<T> = list.to_vec();
    let mut rng = thread_rng();
    shuffled_list.shuffle(&mut rng);
    shuffled_list
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_all_indicies_of() {
        let indices_matches = all_indicies_of("nathan", 'a');
        let indices_nomatches = all_indicies_of("nathan", 'Z');

        assert_eq!(indices_matches, vec![1, 4]);
        assert_eq!(indices_nomatches, Vec::<usize>::new());
    }
}
