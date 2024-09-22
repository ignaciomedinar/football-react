from flask import jsonify, Flask, render_template, request, send_from_directory, redirect
import mysql.connector
import datetime
from dateutil.relativedelta import relativedelta
import calendar
from flask_cors import CORS

app = Flask(__name__)
CORS(app,origins='*')

def add_days(date, days):
    return date + datetime.timedelta(days=days)
# Register the custom filter
app.jinja_env.filters['add_days'] = add_days

@app.route('/api/calendar', methods=['GET'])
def get_matches():
    # Connect to the database
    cnx = mysql.connector.connect(
        host='eu-cluster-west-01.k8s.cleardb.net',
        database='heroku_9f69e70d94a5650',
        user='b902878f5a41b4',
        password='4acedb6a',
        port='3306'
    )
    cursor = cnx.cursor()

    # Define the current week range and the 6-month range
    current_week_start = datetime.datetime.now().date() - datetime.timedelta(days=datetime.datetime.now().weekday())
    six_months = datetime.date.today() + relativedelta(months=+4)

    # Query the database
    query = ("SELECT fr.*, fl.flag_url "
             "FROM football_results fr "
             "LEFT JOIN heroku_9f69e70d94a5650.leagues lg ON fr.league = lg.league "
             "LEFT JOIN heroku_9f69e70d94a5650.flags fl ON upper(fl.country) = upper(lg.country) "
             "WHERE date >= %s "
             "AND date <= %s "
             "AND (goalslocal = '' OR goalslocal IS NULL) "
             "ORDER BY date ASC, fr.league")
    
    cursor.execute(query, (current_week_start, six_months))
    
    # Get the column names and create a list of dictionaries
    columns = [col[0] for col in cursor.description]
    matches = [dict(zip(columns, row)) for row in cursor.fetchall()]

    # Close the database connection
    cursor.close()
    cnx.close()

    # Return the matches as JSON
    return jsonify(matches)

@app.route('/api/predictions', methods=['GET'])
def show_predictions():
    # Connect to the database
    cnx = mysql.connector.connect(
        host='eu-cluster-west-01.k8s.cleardb.net',
        database='heroku_9f69e70d94a5650',
        user='b902878f5a41b4',
        password='4acedb6a',
        port='3306'
    )
    cursor = cnx.cursor()
    
    previous_week_start = (datetime.datetime.now().date() - datetime.timedelta(days=datetime.datetime.now().weekday())) - datetime.timedelta(days=7)
    current_week_start = previous_week_start + datetime.timedelta(days=7)
    current_week_end = previous_week_start + datetime.timedelta(days=13)
    
    # Query the database for the results for the current week
    query = ("SELECT DISTINCT pr.*, r.result, "
             "CASE WHEN r.goalslocal IS NULL THEN '' ELSE r.goalslocal END AS goalslocal, "
             "CASE WHEN r.goalsvisitor IS NULL THEN '' ELSE r.goalsvisitor END AS goalsvisitor, "
             "fl.flag_url, lg.country "
             "FROM heroku_9f69e70d94a5650.predictions_espn pr "
             "LEFT JOIN heroku_9f69e70d94a5650.football_results r "
             "ON pr.date = r.date AND pr.local = r.local AND pr.visitor = r.visitor "
             "LEFT JOIN heroku_9f69e70d94a5650.leagues lg "
             "ON UPPER(lg.League) = UPPER(pr.League) "
             "LEFT JOIN heroku_9f69e70d94a5650.flags fl "
             "ON UPPER(fl.Country) = UPPER(lg.Country) "
             "WHERE pr.date >= %s AND pr.date <= %s "
             "AND lg.Country NOT IN ('America', 'Europe', 'Africa', 'Asia', 'Concacaf', 'Conmebol', 'Europe', 'World') "
             "AND lg.league NOT IN ("
             "'Copa Do Brazil', "
             "'U.S. Open Cup', "
             "'Copa de la Liga de Inglaterra', "
             "'Copa de Alemania', "
             "'Coppa Italia') "
             "ORDER BY pr.max_prob DESC"
             )
    
    cursor.execute(query, (current_week_start, current_week_end))
    
    # Get the column names
    columns = [col[0] for col in cursor.description]

    # Fetch all rows and convert to list of dictionaries
    predictions = [dict(zip(columns, row)) for row in cursor.fetchall()]

    # Close the database connection
    cursor.close()
    cnx.close()

    # Return JSON response
    return jsonify(predictions)

if __name__ == "__main__":
    app.run(debug=True)  #, port=5000