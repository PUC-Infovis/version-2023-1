import pandas as pd

df = pd.read_csv('archive/Video_Games_Sales_as_at_22_Dec_2016.csv')

df.dropna(
    axis=0,
    how='any',
    thresh=None,
    subset=None,
    inplace=True
)

df.to_csv('video_games_preprocessed',index=True)
df[['User_Score']] = df[['User_Score']].apply(pd.to_numeric)
# print(df.columns)
def q1(x):
    return x.quantile(0.25)

def q3(x):
    return x.quantile(0.75)
datos_descriptivos_generos = {'User_Score': ['median', 'min', 'max', q1, q3]}
result = df.groupby(['Genre', 'Platform']).agg(datos_descriptivos_generos)
# result.to_csv('genre_user_score', index=True)

result2 = df.groupby(['Publisher']).sum()
result2 =   result2[result2['Global_Sales'] > 110]
# result2.to_csv('publisher_region_sales', index=True)

result3 = df[df['Global_Sales'] > 5]
result3 = result3.sort_values(by=['Year_of_Release'])
result3.to_csv('filtered_df.csv', index=True)