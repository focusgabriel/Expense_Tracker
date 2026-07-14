import { useRef } from "react"
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate()
    const Name = useRef<HTMLInputElement>(null);
    const Email = useRef<HTMLInputElement>(null);
    const Password = useRef<HTMLInputElement>(null);
    const Confirm_Password = useRef<HTMLInputElement>(null);

    const submitForm = async(e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      const newUser = {
        name: Name.current?.value,
        email: Email.current?.value.toLowerCase(),
        password: Password.current.value,
        confirm_password: Confirm_Password.current.value
      };
      console.log(newUser);

      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/auth/register", 
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser)
          }
        );
        const data = await response.json();
        if(!response.ok){
          throw new Error("Error sending data");
        }
        console.log(data);

      } catch(error) {
        console.log(error)
      }
      Name.current.value = ""
      Email.current.value = ""
      Password.current.value = ""
      Confirm_Password.current.value = ""

      navigate("/overview")
    }


  

  return (
    <div>
      <form onSubmit={submitForm}>
        <div className="flex flex-col gap-4">
          <label htmlFor="Name" className="labelClass">Name</label>
          <input type="text" ref={Name} id="name" name="name" className="fieldClass" />
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="Email" className="labelClass">Email</label>
          <input type="email" ref={Email} id="email" name="email" className="fieldClass" />
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="Password" className="labelClass">Password</label>
          <input type="password" ref={Password} id="password" name="password" className="fieldClass" />
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="Confirm_Password" className="labelClass">Confirm_Password</label>
          <input type="password" ref={Confirm_Password} id="confirm_password" name="confirm_password" className="fieldClass" />
        </div>
        <button
          type="submit"
          className="col-span-full rounded-full bg-emerald-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 cursor-pointer"
        >Register</button>
      </form>
    </div>
  )
}

export default Register