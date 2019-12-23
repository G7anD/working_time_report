import {
  ColumnDirective,
  ColumnsDirective,
  Filter,
  GridComponent,
  Group,
  Inject,
  Page,
  Sort
} from "@syncfusion/ej2-react-grids";
import { DateRangePickerComponent } from "@syncfusion/ej2-react-calendars";
import "./index.css";
import * as React from "react";
import axios from 'axios';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.end = new Date();
    this.start = new Date(this.end);
    this.start.setDate(this.start.getDate() - 1);
    this.loadData = this.loadData.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {

    this.loadData();
  }
  formatDate(date) {
    if (!date)
        return null;
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}
  loadData() {
    let url = 'http://web.uztex.uz:8000/api/v1/working-time/';
    if (this.dt_period.startDate && this.dt_period.endDate) {
        let start = this.formatDate(this.dt_period.startDate);
        let end_date = new Date(this.dt_period.endDate);
        end_date.setDate(end_date.getDate());
        let end = this.formatDate(end_date);
        url += `?start_time=${start} 23:00:00&end_time=${end} 01:00:00`;
    } 
    axios
      .get(url)
      .then(res => {
        this.grid.dataSource = res.data;
      });
  }
  handleChange() {
    this.grid.dataSource =  null;
    this.loadData();
  }

  render() {
    return (
      <div className='control-pane'>
        <div className='control-section'>
          <DateRangePickerComponent
            id="daterangepicker"
            placeholder="Select a range"
            ref={dt => this.dt_period = dt}
            startDate={this.start}
            endDate={this.end}
            change={this.handleChange}
          />
          <GridComponent
            allowPaging={true}
            ref={g => {
              this.grid = g
            }}>
            <ColumnsDirective>
              <ColumnDirective field="MachCode" headerText="Machine code" width="80" textAlign="Right" />
              <ColumnDirective field="duration" headerText="Duration" format="dd/MM/yyyy" width="80" textAlign="Right" />
              <ColumnDirective field="status" headerText="Status" width="80" textAlign="Right" />
              <ColumnDirective field="groupCode" headerText="Group code" width="80" textAlign="Right" />
            </ColumnsDirective>
            <Inject services={[Page, Sort, Filter, Group]} />
          </GridComponent>
        </div>
      </div>
    );
  }
}
