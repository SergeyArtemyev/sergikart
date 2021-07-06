const onSubmit = async () => {
    const form = document.querySelector('form');
    const dataArray = [];
    let params;

    form.addEventListener('formdata', async (e) => {
        let formData = e.formData;
        for (var [key, value] of formData.entries()) {
            dataArray.push([key, value]);
        }
        params = Object.fromEntries(dataArray);
    });

    new FormData(form);

    fetch('http://localhost:8000/post')
        .then((res) => res.json())
        .then((data) => console.log(data));
    // fetch('http://localhost:8000/post', {
    //     method: 'POST',
    //     body: JSON.stringify(params),
    //     mode: 'cors',
    //     headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
    //     },
    // }).then((res) => console.log(1));
};
