import axios from "axios";
import { useEffect, useState } from "react";
import styles from '../styles/User.module.css';
import AddBonus from "./AddBonus";

const User = ({ user }) => {
    const [checkedAdmin, setCheckedAdmin] = useState(user.esteAdmin);
    const [checkedAngajat, setCheckedAngajat] = useState(user.apartineFirmei);
    const [updatedUser, setUpdatedUser] = useState({
        id: user.id,
        mail: user.mail,
        nume: user.nume,
        esteAdmin: user.esteAdmin,
        apartineFirmei: user.apartineFirmei
    });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setUpdatedUser((prevUser) => ({
            ...prevUser,
            esteAdmin: checkedAdmin,
        }));
    }, [checkedAdmin]);

    const handleAdminCheck = async () => {
        const newCheckedAdmin = !checkedAdmin;
        setCheckedAdmin(newCheckedAdmin);

        const updatedUserData = {
            ...updatedUser,
            esteAdmin: newCheckedAdmin,
        };

        try {
            await axios.put(`http://localhost:8080/api/user/update/${user.id}`, updatedUserData, { withCredentials: true });
            setUpdatedUser(updatedUserData);
        } catch (err) {
            console.log(err);
        }
    };

    const handleAngajatCheck = async () => {
        const newCheckedAngajat = !checkedAngajat;
        setCheckedAngajat(newCheckedAngajat);

        const updatedUserData = {
            ...updatedUser,
            apartineFirmei: newCheckedAngajat,
        };

        try {
            await axios.put(`http://localhost:8080/api/user/update/${user.id}`, updatedUserData, { withCredentials: true });
            setUpdatedUser(updatedUserData);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/user/delete/${user.id}`, { withCredentials: true });
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    const handleOpenModal = () => {
        setShowModal(true);
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className={updatedUser.esteAdmin ? styles.esteAdmin : null}>
            <p>Nume: {user.nume}</p>
            <p>Mail: {user.mail}</p>
            <p>Este admin: <input type="checkbox" checked={checkedAdmin} onChange={handleAdminCheck} /></p>
            <p>Este angajat: <input type="checkbox" checked={checkedAngajat} onChange={handleAngajatCheck} /></p>
            <button onClick={handleDelete}>Sterge utilizator</button>
            <div className={styles.bonus_container}>
                <button onClick={handleOpenModal}>Acorda bonus</button>
                <AddBonus show={showModal} onClose={handleCloseModal} userId={user.id}/>
            </div> 
        </div>
    );
};

export default User;
