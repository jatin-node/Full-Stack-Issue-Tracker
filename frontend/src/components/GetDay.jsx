// Desc: Get the day of the week from the publishedAt date
let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let days = ['Sunday', 'Monday', 'Tueday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const GetDay = (publishedAt) => {
    let date = new Date(publishedAt);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export default GetDay