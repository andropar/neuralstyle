from flask import Flask, render_template, request, send_file, jsonify
import flask
import glob, os
import sys
import uuid
from tempfile import NamedTemporaryFile
from shutil import copyfileobj

sys.path.append('fast_neural_style/neural_style')
from fast_neural_style.neural_style import neural_style as ns

IMG_DIR = os.path.abspath('static/img/')

app = Flask(__name__, template_folder='templates')

@app.route('/')
def index():

    styles = []
    
    for filename in os.listdir(os.path.join(IMG_DIR, 'style-images')):
        styles.append(
            {
                'img_src': 'static/img/style-images/' + filename,
                'name': filename.split('.')[0]
            }
        )

    return render_template('index.html', styles=styles)


@app.route('/upload_image', methods=['POST'])
def upload_image():
    img = request.files.get('img', '')
    print(img)
    return "Yay"


@app.route('/stylize_image', methods=['POST'])
def stylize_image():
    ct_img = request.files.get('img')
    ct_tmp = '{}.jpg'.format(uuid.uuid4())
    ct_img.save(ct_tmp)

    style = request.form['style']

    model = os.path.join('fast_neural_style', 'saved_models', '{}.pth'.format(style))

    output_filename = '{}.jpg'.format(uuid.uuid4())
    output_file = os.path.join('static', 'img', 'output', output_filename)

    try:
        ns.stylize_from_flask(True, ct_tmp, None, model, output_file)
    except Exception as e:
        print(e)

    os.remove(ct_tmp)

    return jsonify({'output_url': 'static/img/output/{}'.format(output_filename)})

if __name__ == '__main__':
    app.run(debug=True)