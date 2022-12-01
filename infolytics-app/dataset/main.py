import csv, os

def split_data_by_country():
    with open("survey.csv", 'r') as f:
        headers = f.readline()

    with open("survey.csv", 'r') as file:
        csvreader = csv.DictReader(file)

        for row in csvreader:
            country = row["Country"]

            line = ""
            for i in row.values():
                line += f"{i}, "

            fname = f'{country.lower().replace(" ","")}.csv'
            if not os.path.exists(fname):
                with open(fname, 'a+') as f:
                    f.write(headers)

            with open(fname, 'a+') as f:
                f.write(line+"\n")
            
            line = ""

split_data_by_country()