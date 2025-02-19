export const config = {
    apiBaseUrl: "https://localhost:44366/api",
    auth: {
        signUpEndpoint: "/auth/signup",
        signInEndpoint: "/auth/signin",
        authorizeEndpoint: "/auth/authorize"
    },
    user: {
        accountEndpoint: "/account"
    },
    tablature: {
        userListEndpoint: "/Tablature/GetUserTablaturesInfo",
        getEndpoint: "/Tablature/GetTablature",
        addEndpoint: "/Tablature/AddTablature",
        deleteEndpoint: "/Tablature/DeleteTablature",
        updateEndpoint: "/Tablature/UpdateTablature"
    }
}