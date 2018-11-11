# -*- coding: utf-8 -*-
"""
Created on Tue Nov  6 14:53:37 2018

@author: Greg
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pandas.plotting import scatter_matrix
from pandas import set_option
from pandas import read_csv
import statsmodels.api as sm

from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.externals import joblib

filename = 'responses.csv'

data = read_csv(filename)

sumNullRws = data.isnull().sum()
data = data.dropna()
#data = data.reset_index()
data = data.apply(pd.to_numeric)
#data.drop('index', axis=1)

# Randomize rows
data = data.sample(frac=1).reset_index(drop=True)

"""

# Histogram
plt.figure()
data.hist()
plt.show()

# Correlation heatmap
plt.figure() # new plot
corMat = data.corr(method='pearson')
print(corMat)
sns.heatmap(corMat, square=True)
plt.yticks(rotation=0)
plt.xticks(rotation=90)
plt.title("Correlation Matrix Using Heatmap")
plt.show()

# Scatterplot
plt.figure()
scatter_matrix(data)
plt.show()

"""

#data_x = data.columns[0] # data.drop(data.columns[0], axis=1)
#data_y = data.columns[4] # data.drop(data.columns[4], axis=1)

# Convert to 2d array
array = data.values

# Pull 
arr_y = array[:, 0:1] # Weekly miles run
arr_x = array[:, 4:5] # Fastest mile time

ntest = 10

x_train = arr_x[:-ntest]
x_test= arr_x[-ntest:]

y_train = arr_y[:-ntest]
y_test = arr_y[-ntest:]

regr = LinearRegression()

regr.fit(x_train, y_train)

prediction = regr.predict(x_test)

# The coefficients
print('Coefficients: \n', regr.coef_)
# The mean squared error
print("Mean squared error: %.2f"
      % mean_squared_error(y_test, prediction))
# Explained variance score: 1 is perfect prediction
print('Variance score: %.2f' % r2_score(y_test, prediction))

# Plot outputs
plt.scatter(x_test, y_test,  color='black')
plt.plot(x_test, prediction, color='blue', linewidth=3)

plt.xticks(())
plt.yticks(())

plt.show()

joblib.dump(regr, 'model.joblib')

print("Donezo")