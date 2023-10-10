const form = document.getElementById('forgot-password-form');
const emailField = document.getElementById('email');

form.addEventListener('submit', async (e) =>{
    e.preventDefault();
    try {
        const email = emailField.value;
        console.log(email);
        const res = await axios.post(`http://localhost:3000/password/forgotpassword`, {email: email})
        if(res.status === 200) {
            alert(res.data.message);
            window.location.href ='../views/signup.html';
        }
    }
    catch (error) {
        console.log(error);
    }
})