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
    this.state = {
      end: this.end.getFullYear() + "-" + (this.end.getMonth() + 1) + "-" + this.end.getDate(),
      start: this.start.getFullYear() + "-" + (this.start.getMonth() + 1) + "-" + this.start.getDate()
    }

    axios
      .get(
        "http://web.uztex.uz:8000/api/v1/working-time/?start_time=" + this.state.start + " 23:00:00&end_time=" + this.state.end + " 01:00:00"
      )
      .then(res => {
        this.grid.dataSource = res.data;
        console.log(this.state.end, this.state.start);
      });
  }
  render() {
    return (
      <div className='control-pane'>
        <div className='control-section'>
          <DateRangePickerComponent
            id="daterangepicker"
            placeholder="Select a range"
            startDate={this.start}
            endDate={this.end}
            onChange={this.handleChange}
          />
          <GridComponent
            allowPaging={true} ref={g => {
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
