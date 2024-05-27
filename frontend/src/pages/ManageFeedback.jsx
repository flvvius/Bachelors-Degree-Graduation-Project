import axios from "axios";
import { useEffect, useState } from "react";
import AdminFeedback from "../components/AdminFeedback";
import { useNavigate } from "react-router-dom";

const ManageFeedback = () => {

    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/feedback/getAll", {withCredentials: true});
                setFeedbacks(response.data);
            } catch(err) {
                console.log(err)
            }
        }

        fetchData();

        const intervalId = setInterval(fetchData, 5000);

        return () => clearInterval(intervalId);

    }, [])

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/home');
    }

    return (
        <div>
            <h1>Feedbacks</h1>
            {
                feedbacks.map(feedback => (
                    <AdminFeedback key={feedback.id} feedback={feedback} />
                ))
            }
            <button onClick={handleGoBack}>Go back</button>
        </div>
    )
}

export default ManageFeedback;