import { useState } from "react"

const index = () => {
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();

    const handleChange = (e) => {

     let usersname =e.target.value;

        setUsername(usersname);

        const newUserName = usersname.replace(" ","")
        setEmail = newUserName+"@loansaarthi.com"
    }
    return (
        <div>
      <input type="text"
                placeholder='name'
                name='username'
                value={username}
                onChange={handleChange}
            />

            <input type="text"
                placeholder='name'
                name='username'
                readOnly
                value={email}
            />

        </div>
    )
}

export default index