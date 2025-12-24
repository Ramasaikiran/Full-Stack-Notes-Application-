const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function runTests() {
    console.log('Starting Integration Tests...');

    let token = '';
    let userId = '';
    let noteId = '';
    const testUser = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'password123'
    };

    // 1. Register
    try {
        console.log(`\nRegistering user: ${testUser.username}...`);
        const regRes = await axios.post(`${API_URL}/auth/register`, testUser);
        if (regRes.status === 201) {
            console.log(' Registration successful');
        } else {
            console.error(' Registration failed:', regRes.data);
            return;
        }
    } catch (error) {
        console.error(' Registration Error:', error.response ? error.response.data : error.message);
        return;
    }

    // 2. Login
    try {
        console.log('\nLogging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            username: testUser.username,
            password: testUser.password
        });
        if (loginRes.data.token) {
            token = loginRes.data.token;
            userId = loginRes.data.user.id;
            console.log(' Login successful. Token received.');
        } else {
            console.error(' Login failed: No token received');
            return;
        }
    } catch (error) {
        console.error(' Login Error:', error.response ? error.response.data : error.message);
        return;
    }

    // 3. Create Note
    try {
        console.log('\nCreating a note...');
        const noteRes = await axios.post(`${API_URL}/notes`, {
            title: 'Test Note',
            content: 'This is a test note content.'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (noteRes.status === 201) {
            noteId = noteRes.data._id;
            console.log(' Note created successfully');
        } else {
            console.error(' Note creation failed:', noteRes.data);
        }
    } catch (error) {
        console.error(' Note Creation Error:', error.response ? error.response.data : error.message);
    }

    // 4. Fetch Notes
    try {
        console.log('\nFetching notes...');
        const fetchRes = await axios.get(`${API_URL}/notes`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (Array.isArray(fetchRes.data) && fetchRes.data.length > 0) {
            console.log(` Notes fetched successfully. Count: ${fetchRes.data.length}`);
        } else {
            console.warn(' No notes found or fetch failed', fetchRes.data);
        }
    } catch (error) {
        console.error(' Fetch Notes Error:', error.response ? error.response.data : error.message);
    }

    // 5. Delete Note
    if (noteId) {
        try {
            console.log(`\nDeleting note ${noteId}...`);
            const delRes = await axios.delete(`${API_URL}/notes/${noteId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (delRes.status === 200) {
                console.log(' Note deleted successfully');
            } else {
                console.error(' Note deletion failed:', delRes.data);
            }
        } catch (error) {
            console.error(' Note Deletion Error:', error.response ? error.response.data : error.message);
        }
    }

    console.log('\nTests Completed.');
}

runTests();
