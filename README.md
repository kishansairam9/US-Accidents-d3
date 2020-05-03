## Instructions

### Dowload Data Set

- Dowload `cleaned.csv` from https://iiitaphyd-my.sharepoint.com/:u:/g/personal/kishan_sairam_students_iiit_ac_in/EQlMQlK6O3dFlVvXDAZOOoABuxeq2vMF2genAm9pu02Zyg?e=zBa1jx (If downloading cleaned.zip (35MB), then unzip it)
- Place it in same folder as index.html

### Running instructions

- Since `cleaned.csv` is being used to load data, we need to run server for it
- Run `python3 -m http.server` in directory where `index.html` is present and open the URL given to view webpage

## Note

The page may be irresponsive for first few seconds after opening. This is because of loading whole data of csv using d3, 
initially memory usage explodes. It comes to normal soon and page will work fine.