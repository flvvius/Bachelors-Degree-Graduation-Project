import styles from '../styles/Pontaj.module.css'

const Pontaj = () => {

    const currentDate = new Date()

    // const year = currentDate.getFullYear();
    // const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    // const day = String(currentDate.getDate()).padStart(2, '0');

    // const formattedDate = `${year}-${month}-${day}`;

    // console.log(formattedDate);

    const handleCheckIn = () => {
        
    }

    const handleCheckOut = () => {

    }

    return (
        <>
            <h1 className={styles.ceva}>Pontaj</h1> 

            <button onClick={handleCheckIn}>Check-In</button>
            <button onClick={handleCheckOut}>Check-Out</button>    
        </>
    )
}

export default Pontaj;