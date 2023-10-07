const form = document.getElementById('nutritionForm');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  const food = document.getElementById('food').value;

  const appId = 'APP_ID';
  const appKey = 'APP_KEY';
  const apiEndpoint = `https://api.edamam.com/api/nutrition-data?app_id=${appId}&app_key=${appKey}&ingr=${food}`;

  resultDiv.innerHTML = '';
  resultDiv.innerHTML = '<p>Loading...</p>';

  fetch(apiEndpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.totalNutrients) {
        const nutritionInfo = data.totalNutrients;
        resultDiv.innerHTML = `
          <h2>Nutrition Information for ${food}:</h2>
          <p>Calories: ${nutritionInfo.ENERC_KCAL.quantity} ${nutritionInfo.ENERC_KCAL.unit}</p>
          <p>Carbs: ${nutritionInfo.CHOCDF.quantity} ${nutritionInfo.CHOCDF.unit}</p>
          <p>Protein: ${nutritionInfo.PROCNT.quantity} ${nutritionInfo.PROCNT.unit}</p>
          <p>Fat: ${nutritionInfo.FAT.quantity} ${nutritionInfo.FAT.unit}</p>
        `;
      } else {
        resultDiv.innerHTML = '<p>Sorry, nutrition information not found for this food.</p>';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      resultDiv.innerHTML = '<p>Something went wrong. Please try again later.</p>';
    });
});
