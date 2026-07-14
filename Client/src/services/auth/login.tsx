import { useRef } from "react"
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
    const Email = useRef<HTMLInputElement>(null);
    const Password = useRef<HTMLInputElement>(null);;

    const submitForm = async(e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      const AuthUser = {
        email: Email.current?.value.toLowerCase(),
        password: Password.current.value
      };
      console.log(AuthUser);

      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/auth/login", 
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(AuthUser)
          }
        );
        const data = await response.json();
        if(!response.ok){
          throw new Error("Error sending data");
        }
        console.log(data);

        localStorage.setItem("token", data.token);
        navigate("/overview")

      } catch(error) {
        console.log(error)
      }
      Email.current.value = ""
      Password.current.value = ""

      
    }

  return (
    <div>
      <form onSubmit={submitForm}>
        <div className="flex flex-col gap-4">
          <label htmlFor="Email" className="labelClass">Email</label>
          <input type="email" ref={Email} id="email" name="email" className="fieldClass" />
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="Password" className="labelClass">Password</label>
          <input type="password" ref={Password} id="password" name="password" className="fieldClass" />
        </div>
        <button
          type="submit"
          className="col-span-full rounded-full bg-emerald-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 cursor-pointer"
        >Login</button>
        <p>if you don't have an account <Link to="/register">Sign up</Link> Here</p>
      </form>
    </div>
  )
}

export default Login