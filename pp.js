var postData = JSON.stringify({
    "messages": [
        {
            "destination": [
                {
                    "to": 666
                }
            ],
            "from": 99,
            "text": 99
        }
    ]
});

console.log(postData);