import { useState } from 'react'
import './TicketForm.css'
import logo from '../../../ITS-LOGO-NOBG.png'
import axios from "axios";

function TicketForm(){
    const [loading, setLoading] = useState(false);
    const [fileInputKey, setFileInputKey] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [ticket, setTicket] = useState({
        name: '',
        issue: '',
        department: '', 
        description: '',
        priority: '',
        status: '',
        date: new Date().toLocaleDateString(),
        image: '',
        email: ''
    });

    function handleChange(e){
        const {name, value } = e.target;
        setTicket({
            ...ticket,
            [name]: value
        });
    }

    async function handleSubmit(e){
        e.preventDefault();
        setLoading(true);

        const newTicketRef ='ITS-' + crypto.randomUUID().slice(0, 8).toUpperCase();
        const formData = new FormData();

        formData.append("name", ticket.name);
        formData.append("issue", ticket.issue);
        formData.append("department", ticket.department); 
        formData.append("description", ticket.description);
        formData.append("priority", ticket.priority);
        formData.append("status", "Open");    
        formData.append("date", new Date().toLocaleDateString());
        formData.append("ticketRef", newTicketRef);
        formData.append("email", ticket.email);

        if(selectedFile) {
            formData.append("image", selectedFile);
        }

        try {
            await axios.post("http://localhost:5000/api/tickets", formData);

            alert("Ticket submitted successfully!");

            setTicket({
                name: '',
                issue: '',
                department: '',
                description: '',
                priority: '',
                status: '',
                date: new Date().toLocaleDateString(),
                email: ''
            });

            setSelectedFile(null);
            setFileInputKey(Date.now());
        } catch (err) {
            console.error(err);
            alert("Submission failed.");
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className='form-wrapper'>
            <div className='form-container'>
                <div className='logo-container'>
                    <h1>IT Squarehub</h1>
                    <img src={logo} alt="Logo" />
                </div>

                {loading ? (
                    <div className="loader-container">
                        <div className="spinner"></div>
                        <p className="loading-text">Uploading...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className='input-container'>
                            <label htmlFor="name">Name: </label>
                            <input 
                                type="text" 
                                name="name"
                                id='name'
                                value={ticket.name}
                                onChange={handleChange}
                                placeholder='Enter your name'
                                required
                            />
                        </div>

                        <div className='input-container'>
                            <label htmlFor="issue">Issue: </label>
                            <select
                                required 
                                id='issue'
                                name="issue"
                                value={ticket.issue}
                                onChange={handleChange}
                            >
                                <option value="">Choose Below</option>
                                <option value="Hardware">Hardware</option>
                                <option value="Software">Software</option>
                                <option value="Network">Network</option>
                            </select>
                        </div>

                        <div className='input-container'>
                            <label htmlFor="department">Department: </label>
                            <select
                                required 
                                id='department'
                                name="department"
                                value={ticket.department}
                                onChange={handleChange}
                            >
                                <option value="">Select Department</option>
                                <option value="HR">Human Resources (HR)</option>
                                <option value="IT">Information Technology (IT)</option>
                                <option value="Accounting">Accounting</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Operations">Operations</option>
                            </select>
                        </div>

                        <div className='input-container'>
                            <label htmlFor="priority">Priority</label>
                            <select
                                name="priority"
                                id='priority'
                                required
                                value={ticket.priority}
                                onChange={handleChange}
                            >
                                <option value="">Choose Below</option>
                                <option value="Low">Low Priority</option>
                                <option value="Medium">Medium Priority</option>
                                <option value="High">High Priority</option>
                            </select>
                        </div>

                        <div className='input-container'>
                            <label htmlFor="description">Description: </label>
                            <input
                                type="text"
                                name="description"
                                placeholder='Describe the issue'
                                id='description'
                                required
                                value={ticket.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='input-container'>
                            <label htmlFor="email">Email: </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                value={ticket.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='input-container'>
                            <input
                                type="file"
                                key={fileInputKey}
                                required
                                name='image'
                                onChange={(e) => setSelectedFile(e.target.files[0])}
                            />
                            <button type='submit'>
                                Submit Ticket
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default TicketForm;