import React, { useState } from 'react';
import '../styles/Feedback.module.css';
import axios from 'axios';

const Feedback = ({ show, onClose, userId, taskId }) => {

    const tipFeedback = taskId == null ? "Zi de lucru" : "Task"

    const [formData, setFormData] = useState({
        tip_feedback: tipFeedback,
        nota: 0,
        mesaj: "",
        idAngajat: userId,
        idTask: taskId
    });

    if (!show) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        await axios.post('http://localhost:8080/api/feedback/add', formData);
        onClose();
        } catch (error) {
        console.error(error);
        }
    };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="modal-content">
            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="name">Tip feedback:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={taskId == null ? "Zi de lucru" : "Task"}
                        readOnly
                    />
                </div>

                <div>
                <label htmlFor="nota">Nota:</label>
                <input
                    type="number"
                    id="nota"
                    name="nota"
                    value={formData.nota}
                    onChange={handleChange}
                />
                </div>

                <div>
                <label htmlFor="mesaj">Mesaj:</label>
                <textarea
                    id="mesaj"
                    name="mesaj"
                    value={formData.mesaj}
                    onChange={handleChange}
                />
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
