const signUp = document.getElementById("signUp");
const signIn = document.getElementById("signIn");

signIn.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});
signUp.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});



async function login(event) {
  try{
      event.preventDefault();
      const email = event.target.loginEmail.value;
      const password = event.target.loginPassword.value;

      const LoginDetails = {
          email: email,
          password: password
      };
      console.log(LoginDetails);
      const response = await axios.post("http://localhost:3000/user/login",LoginDetails)
          if(response.status === 200){
            console.log(response.data.user.name);
            localStorage.setItem('username', response.data.user.name);
            localStorage.setItem('token',response.data.token);
            localStorage.setItem('id',response.data.user.id);
            console.log(response.data.user.id);
            console.log(response.data.token);
            window.location.href = '../views/mainPage.html';
          }
          else if(201){
            window.alert('invalid password');
          }else{
              throw new Error('failed to login');
          }
  }
  catch(err){
      document.body.innerHTML += `<div style="color:red;">${err.message}</div>`;
  }
  event.target.loginEmail.value='';
  event.target.loginPassword.value='';
}