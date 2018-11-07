import sys

import pandas as pd
import numpy as np

from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.externals import joblib

if(len(sys.argv) < 2): exit()

arg = float(sys.argv[1])

# Import model
regr = joblib.load('model.joblib')

x = np.array([ arg ]).reshape(-1, 1)

prediction = regr.predict(x)

print(prediction[0][0])