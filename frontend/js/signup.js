async function signup(event){
    try{
    event.preventDefault();
    const userName=document.getElementById('name').value;
    const email=document.getElementById('email').value;
    const phoneNumber=document.getElementById('number').value;
    const password=document.getElementById('password').value;
    const signUpDetails = {
        name: userName,
        email: email,
        phoneNumber: phoneNumber,
        password: password
    }
    console.log(signUpDetails);
    const response = await axios.post("http://localhost:3000/user/signup",signUpDetails)
    if (response.status === 201) {
        alert("Successfuly signed up");
        document.getElementById('message').innerText = 'Details are submitted to the database';
        localStorage.setItem('users', JSON.stringify(response.data.users));
        } else if (response.status === 202) {
            window.alert("user already exists")
        document.getElementById('message').innerText = 'User already exists, Please Login';
        }
    } catch (err) {
        document.getElementById('message').innerText = 'Failed to sign up';
        console.error(err);
    }
    document.getElementById('name').value='';
    document.getElementById('email').value = '';
    document.getElementById('number').value='';
    password=document.getElementById('password').value='';
}