async function signup(event){
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
    }
    document.getElementById('name').value='';
    document.getElementById('email').value = '';
    document.getElementById('number').value='';
    const password=document.getElementById('password').value='';
