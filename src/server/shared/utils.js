export function shuffle(array){
    let swappedIndex = array.length;
    while(swappedIndex > 0){
        let index = Math.floor(Math.random() * swappedIndex);
        swappedIndex--;

        let temp = array[swappedIndex];
        array[swappedIndex] = array[index];
        array[index] = temp;
    }
}