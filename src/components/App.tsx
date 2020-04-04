import React, { useEffect, useState } from "react";
import * as api from "util/api";
import "scss/styles.scss";
import Home from "./Home";
import StudentDetails from "./StudentDetails";
import Topic from "./Topic";
import { Router } from "@reach/router";
import * as queries from "util/queries";
import { IStudentSummary } from "types";
import Header from "./Header";
import Videos from "./Videos";

interface IAppProps {
  students: IStudentSummary[] | undefined;
}

const App = ({ students }: IAppProps) => {
  const topics = students ? queries.getTags(students) : {};

  return (
    <>
      <Header />
      <Router>
        <Home path="/" students={students} topics={topics} />
        <StudentDetails path="students/:studentIdOrSlug" students={students} />
        <Topic path="topics/:topicSlug" students={students} topics={topics} />
        <Videos path="videos" students={students} />
        <Videos path="videos/:studentSlug" students={students} />
      </Router>
    </>
  );
};

const AppContainer = () => {
  const [students, setStudents] = useState<IStudentSummary[]>();
  useEffect(() => {
    async function fetchAllStudents() {
      const students = await api.getAllStudents();
      setStudents(students);
    }
    fetchAllStudents();
  }, []);

  return <App students={students} />;
};

export default AppContainer;
