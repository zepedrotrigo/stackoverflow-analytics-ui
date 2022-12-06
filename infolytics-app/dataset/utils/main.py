import csv, os, traceback, copy
from urllib.request import urlopen
from currency_converter import CurrencyConverter

# ----------------------------- get country codes ---------------------------- #
countries = {"Kosovo": "KWT"}
equivalent_countries = {"United States of America": "United States", "United Kingdom of Great Britain and Northern Ireland": "United Kingdom", "Russian Federation": "Russia", "Hong Kong (S.A.R.)": "Hong Kong", "South Korea": "Korea Republic of", "Republic of Korea": "Korea Democratic People's Republic of", "Myanmar": "Burma", "Venezuela, Bolivarian Republic of...": "Venezuela", "Iran, Islamic Republic of...": "Iran (Islamic Republic of)"}

for l in urlopen("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv"):
    lst = l.decode("utf-8").split(",")
    lst.pop()
    code = lst.pop()
    name = ''.join(str(e) for e in lst)
    countries[name] = code

# ---------------------------------------------------------------------------- #
#                                   Functions                                  #
# ---------------------------------------------------------------------------- #

def split_data_by_country():
    with open("../survey.csv", 'r') as f:
        headers = f.readline()

    with open("../survey.csv", 'r') as file:
        csvreader = csv.DictReader(file)

        for row in csvreader:
            country = row["Country"]
            if country in equivalent_countries:
                country = equivalent_countries[country]

            line = ""
            for i in row.values():
                line += f"{i}, "

            fpath = f'../entries_by_country/{country}.csv'
            if not os.path.exists(fpath):
                with open(fpath, 'a+') as f:
                    f.write(headers)

            with open(fpath, 'a+') as f:
                f.write(line+"\n")
            
            line = ""

def calc_avg_salary_by_country():
    '''Only takes into account full-time employees working full in-person'''

    c = CurrencyConverter()
    d = {} # {"Country": [SumOfCompTotal, NoOfRespondents]}

    with open("../survey.csv", 'r') as f:
        csvreader = csv.DictReader(f)

        for row in csvreader:
            country = row["Country"]
            comp_total = row["CompTotal"]
            comp_freq = row["CompFreq"]
            remote_work = row["RemoteWork"]
            employment = row["Employment"]
            currency = row["Currency"].split()[0]

            if remote_work != "Full in-person" or employment != "Employed, full-time":
                continue

            if comp_freq != "NA" and comp_total != "NA":
                try:
                    comp_total = c.convert(float(comp_total), currency, 'USD')
                except:
                    continue

                if comp_freq == "Yearly":
                    annual_salary = comp_total
                if comp_freq == "Monthly":
                    annual_salary = comp_total*12
                elif comp_freq == "Weekly":
                    annual_salary = comp_total*52

                if country in d:
                    comp_total_sum, n_respondents = d[country]
                    d[country] = [comp_total_sum+annual_salary, n_respondents+1]
                else:
                    d[country] = [annual_salary, 1]


    with open("../avg_salary_by_country.csv", 'w') as f:
        f.write("Country,Code,AvgSalary\n")

        for k,v in d.items():
            if k in equivalent_countries:
                k = equivalent_countries[k]
            f.write(f'{k},{countries[k]},{int(v[0]/v[1])}\n')

def avg_salary_by_country_by_job():
    '''Only takes into account full-time employees working full in-person'''
    c = CurrencyConverter()
    template_jobs_dict = {'Developer embedded applications or devices': [], 'Cloud infrastructure engineer': [], 'Developer front-end': [], 'Project manager': [], 'Product manager': [], 'Engineering manager': [], 'System administrator': [], 'Scientist': [], 'Blockchain': [], 'Data or business analyst': [], 'Engineer data': [], 'Marketing or sales professional': [], 'Student': [], 'Developer full-stack': [], 'Data scientist or machine learning specialist': [], 'Other (please specify):': [], 'Security professional': [], 'Engineer site reliability': [], 'Developer game or graphics': [], 'Designer': [], 'Developer mobile': [], 'DevOps specialist': [], 'Developer desktop or enterprise applications': [], 'NA': [], 'Database administrator': [], 'Academic researcher': [], 'Developer QA or test': [], 'Developer back-end': [], 'Educator': [], 'Senior Executive (C-Suite VP etc.)': []}
    d = {} # {"Country":  {"Job1": [SumOfCompTotal, NoOfRespondents], ...}}

    with open("../survey.csv", 'r') as f:
        csvreader = csv.DictReader(f)

        for row in csvreader:
            country = row["Country"]
            comp_total = row["CompTotal"]
            comp_freq = row["CompFreq"]
            remote_work = row["RemoteWork"]
            employment = row["Employment"]
            currency = row["Currency"].split()[0]
            jobs = row["DevType"].replace(",","").split(";")

            if remote_work != "Full in-person" or employment != "Employed, full-time":
                continue

            if comp_freq == "NA" or comp_total == "NA":
                continue

            try:
                comp_total = c.convert(float(comp_total), currency, 'USD')
            except:
                continue

            if comp_freq == "Yearly":
                annual_salary = comp_total
            if comp_freq == "Monthly":
                annual_salary = comp_total*12
            elif comp_freq == "Weekly":
                annual_salary = comp_total*52
            
            for job in jobs:
                if country in d and job in d[country]:
                    d[country][job].append(annual_salary)
                else:
                    d[country] = copy.deepcopy(template_jobs_dict)
                    d[country][job] = [annual_salary]
            


    with open("../avg_salary_by_country_by_job.csv", 'w') as f:
        csv_header = 'Country,' + ''.join(str(e+",") for e in template_jobs_dict)[:-1]
        f.write(f"{csv_header}\n")

        for k,v in d.items():
            if k in equivalent_countries:
                k = equivalent_countries[k]

            f.write(k)

            for _,lst in v.items():
                avg = 0
                try:
                    avg = int(sum(lst)/len(lst))
                except:
                    pass

                f.write(f',{avg}')
            f.write("\n")

# ---------------------------------------------------------------------------- #
#                                     Main                                     #
# ---------------------------------------------------------------------------- #

def main():
    #split_data_by_country()
    calc_avg_salary_by_country()
    #avg_salary_by_country_by_job()


if __name__ == '__main__':
    main()