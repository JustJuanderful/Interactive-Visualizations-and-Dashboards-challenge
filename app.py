from flask import Flask, render_template

# Flask
app = Flask(__name__)

# Route
@app.route("/")
def main():
    
    # Homepage redirect
    return render_template("index.html")  

if __name__ == "__main__":
    app.run(debug=True)