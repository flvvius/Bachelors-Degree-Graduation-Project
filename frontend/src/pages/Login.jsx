import styles from "../styles/Login.module.css";
// import axios from "axios";

export default function Login() {


    const googleAuth = async (e) => {
        e.preventDefault()
        await window.open(`http://localhost:8080/api/auth/`, "_self");
    }

    return (
        <div className={styles.container}>
			<h1 className={styles.heading}>Log in Form</h1>
			<div className={styles.form_container}>
					<button className={styles.google_btn} onClick={(e)=>googleAuth(e)}>
						<img src="./images/google.png" alt="google icon" />
						<span>Sign in with Google</span>
					</button>
			</div>
		</div>
    );
}