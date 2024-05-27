import { useState } from 'react';
import styles from '../styles/UploadTask.module.css'

const UploadTask = ({users, onSubmit}) => {

    const [formData, setFormData] = useState({
        titlu: "",
        descriere: "",
        deadline: "",
        importanta: "",
        userIds: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleUserSelect = (e) => {
        const options = e.target.options;
        const selectedUserIds = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedUserIds.push(options[i].value);
            }
        }
        setFormData({
            ...formData,
            userIds: selectedUserIds
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Titlu:
                    <input
                        type="text"
                        name="titlu"
                        value={formData.titlu}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Descriere:
                    <textarea
                        name="descriere"
                        value={formData.descriere}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Deadline:
                    <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Importanță:
                    <select
                        name="importanta"
                        value={formData.importanta}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selectează importanța</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    User IDs:
                    <select
                        multiple
                        name="userIds"
                        value={formData.userIds}
                        onChange={handleUserSelect}
                        className={styles.select_multiple}
                        required
                    >
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.nume}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <button type="submit">Submit</button>
        </form>
    )
}

export default UploadTask;