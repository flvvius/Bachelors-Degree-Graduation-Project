import { useEffect, useState } from 'react'
import styles from '../styles/Pontaj.module.css'
import axios from 'axios'

const Pontaj = ({userId}) => {

    const currentDate = new Date()
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [pontaj, setPontaj] = useState({
        data: currentDate,
        check_in: null,
        check_out: null,
        idUser: userId
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/pontaj/getPontajByData/${userId}`, {withCredentials: true});

                if (response.data) {
                    setPontaj(response.data);
                    setCheckInDate(response.data.check_in);
                    setCheckOutDate(response.data.check_out);
                }


            } catch (err) {
                console.log(err);
            }
        }

        fetchData();
    }, [userId])

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleCheckIn = () => {

        if (checkInDate != null) {
            return;
        }

        const currentDate = new Date();

        setPontaj((prevPontaj) => ({
            ...prevPontaj,
            check_in: currentDate
        }));        
        setCheckInDate(formatDate(currentDate));
    };

    const handleCheckOut = async () => {

        if (checkOutDate != null) {
            return;
        }

        if (checkInDate == null) {
            alert("You can't check-out if u haven't checked-in first.");
            return;
        }

        const currentDate = new Date();
        const updatedPontaj = {
            ...pontaj,
            check_out: currentDate
        };

        setPontaj(updatedPontaj);
        setCheckOutDate(formatDate(currentDate));

        try {
            const response = await axios.post("http://localhost:8080/api/pontaj/add", updatedPontaj, { withCredentials: true });
            console.log(response);
        } catch (error) {
            console.error(error);
        }

    };

    return (
        <>
            <h1 className={styles.ceva}>Pontaj</h1> 

            <div>
                {checkInDate && <p>Check-In Date: {checkInDate}</p>}
                <button onClick={handleCheckIn}>Check-In</button>
            </div>

            <div>
                {checkOutDate && <p>Check-Out Date: {checkOutDate}</p>}
                <button onClick={handleCheckOut}>Check-Out</button>     
            </div>
        </>
    )
}

export default Pontaj;