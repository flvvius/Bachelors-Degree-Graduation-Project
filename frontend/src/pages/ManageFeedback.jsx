import axios from "axios";
import { useEffect, useState } from "react";
import AdminFeedback from "../components/AdminFeedback";

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

    }, [])

    return (
        <div>
            {
                feedbacks.map(feedback => (
                    <AdminFeedback key={feedback.id} feedback={feedback} />
                ))
            }
        </div>
    )
}

export default ManageFeedback;