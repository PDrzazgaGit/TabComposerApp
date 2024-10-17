
export const signUp = async (email: string, username: string, password: string) => {
    const response = await fetch('https://localhost:44366/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, username, password })
    });

    if (!response.ok) {
        throw new Error('Failed to sign up');
    }

    return response.json();
};


export const signIn = async (username: string, password: string) => {
    const response = await fetch('https://localhost:44366/api/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      
        throw new Error('Failed to sign in');
    }

    return response.json(); 
};