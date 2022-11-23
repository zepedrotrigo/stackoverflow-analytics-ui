import csv


# PRINT DATASET BY ROW
def printDataset():
    with open("survey_results_public.csv", 'r') as file:
        csvreader = csv.reader(file)
        for row in csvreader:
            print(row)


# CREATE A CSV FILE WITH THE HEADER OF THE DATASET
def createHeader():
    with open("survey_results_public.csv", 'r') as file:
        csvreader = csv.reader(file)
        for row in csvreader:
            print(row)
            with open("header.csv", 'w') as file2:
                file2.write(str(row))
            break


# PRINT HEADER OF THE DATASET
def printHeader():
    with open("survey_results_public.csv", 'r') as file:
        csvreader = csv.reader(file)
        for row in csvreader:
            print(row)
            break


# CREATE CSV FILE WITH DEV TYPE AND SALARY
def devtype_salary_csv():
    dic = {}
    count = 0

    with open("survey_results_public.csv", 'r') as file:
        csvreader = csv.reader(file)
        for row in csvreader:
            if count>0:
                jobs = row[11]
                jobs = jobs.split(';')
                salary = row[-1]
                if salary!='NA':
                    for job in jobs:
                        if job not in dic.keys() and job!='NA':
                            dic[job] = [salary]
                        if job in dic.keys()  and job!='NA':
                            dic[job].append(salary)
            count+=1
    
    for key in dic.keys():
        total = 0
        count = 0
        for salary in dic[key]:
            total += int(salary)
            count += 1
        dic[key] = int(total/count)

    with open("job_salary.csv", 'w') as file:
        file.write("job,avgsalary\n")
        for key in dic.keys():
            strFinal = key + "," + str(dic[key]) + "\n"
            file.write(strFinal)

            


devtype_salary_csv()
    

