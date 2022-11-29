const serverURL = {
    https: "http://47.91.91.180:443",
    wss: "ws://localhost:443"
};
const my_accounts = [
    {
        public: "0xAB1df60573B7c810649f9e34d0cf70b212c3A564",
        private: "2ae4d5b5af695b4517ab1bea126319500ff24a1df23ab204971336b63bb2f040"
    },
];
const rpc = {
    "https": "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",    //should replace local node...
    "wss": "ws://127.0.0.1:28333/ws"
}

export default {serverURL,my_accounts,rpc,"bloxRouteAuthHeader": "MjU4YjcwYjctNjZiNS00ZDZhLTk1M2UtMDdjYWU4NzA3YzQ5OmRjZWVkZWQ2ZmRhOTUyYjdiODc2YmE5ZjA5YTYxMTM3",
};