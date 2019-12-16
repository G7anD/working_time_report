import pandas as pd


class GetReportTable:
    """ report by per machines' working and notworking time """

    def __init__(self, fileName):
        self.data = pd.read_csv(fileName, parse_dates=['DateRec'])

    def setPeriod(self, start, end):
        """ setting up report's period """
        dateMask = (self.data['DateRec'] >= start) & (
            (self.data['DateRec'] <= end))

        self.data = self.data.loc[dateMask,
                                  ['StopCode', 'DateRec', 'GroupCode',
                                   'MachCode']]
        print("period setting is has been passed")

    def run(self):
        """ main procces """
        self.makeGroup(step=1)
        self.data['status'] = self.data['StopCode'].apply(lambda x: x == 0)
        print("applying run status code(1,0) is has been passed")
        self.data['duration'] = self.data.apply(self.estimateDuration, axis=1)
        print("esttimating per status duration is has been passed")
        self.exportTo_csv(name="estimated_per_status")
        self.data = self.data.dropna(axis=0)
        self.makeGroup(step=2)
        self.exportTo_csv(name="final_output")

    def estimateDuration(self, row):
        """ esttimating per status duration """
        index = row.name
        gr = row['GroupCode']
        mch = row['MachCode']
        dt = row['DateRec']

        if index < self.data.shape[0]-1:
            nextItem = self.data.iloc[index+1]
            if(nextItem['GroupCode'] == gr and nextItem['MachCode'] == mch):
                return nextItem['DateRec']-dt
            else:
                return None
        else:
            return None

    def makeGroup(self, step=1):
        """ making group by per group machine and etc. """
        if step == 1:
            self.data = self.data.groupby(
                ['GroupCode', 'MachCode', 'DateRec', 'StopCode']).count()
            self.data = self.data.reset_index()
            print("making groups step = 1 is has been passed")
        elif step == 2:
            self.data = self.data.groupby(
                ['GroupCode', 'MachCode', 'status']).agg({'duration': 'sum'})
            print("making groups step = 2 is has been passed")

    def exportTo_csv(self, name='output'):
        filename = "{}-{}.csv".format(name, pd.Timestamp.today())
        self.data.to_csv(filename)
        print("exporting\n filename: {} is has been passed".format(filename))


fileName = "1312.csv"
start = '2019-12-13 08:00:00.000'
end = '2019-12-14 20:00:00.000'

makeReport = GetReportTable(fileName)
makeReport.setPeriod(start, end)
makeReport.run()
