export const fetchWithToken = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        throw new Error('No access token found');
    }


    const headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 403) {
        const refreshed = await refreshToken();
        if (refreshed) {
            return fetchWithToken(url, options);
        } else {
            throw new Error('Unauthorized');
        }
    }

    return response;
};

const refreshToken = async (): Promise<boolean> => {
    const token = localStorage.getItem('refreshToken');

    if (!token) {
        console.error('No refresh token found in localStorage');
        return false
    }

    const response = await fetch('http://localhost:3000/users/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
    });

    if (!response.ok) {
        console.error('Failed to refresh token, response not ok');
        return false
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    return true;
};

export const logout = async (): Promise<void> => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            console.error('Refresh token tidak ditemukan');
            return;
        }

        const response = await fetch('http://localhost:3000/users/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: refreshToken }),
        });

        if (!response.ok) {
            console.error('Gagal melakukan logout di backend');
        }

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userName');

        console.log('Logout berhasil');
    } catch (err) {
        console.error('Terjadi kesalahan saat logout:', err);
    }
};
