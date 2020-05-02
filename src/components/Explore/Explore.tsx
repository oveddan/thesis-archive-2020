import React, { useState, useEffect, useMemo } from "react";
// import StudentCards from "./StudentCards";
import { IStudentSummary, TopicDict, ISearch } from "types";
import DraggableCards from "./DraggableCards";
import { Container } from "react-bootstrap";
import Footer from "../Footer/index";
import { useRouteMatch } from "react-router-dom";
import * as queries from "util/queries";
import { buildSearch } from "util/search";

const generateTitle = (tag: string | null, advisor: string | null): string => {
  const opener = "ITP Thesis Archive 2020";
  if (tag) {
    return `${opener} | Projects with Category ${tag}`;
  } else if (advisor) {
    return `${opener} | Projects under Advisor ${advisor}`;
  }

  return opener;
};

interface IHomeProps {
  students: IStudentSummary[] | undefined;
  isExploring: boolean;
}
const updateFilteredStudents = (
  students: IStudentSummary[],
  filter: (student: IStudentSummary) => boolean
): IStudentSummary[] => {
  return students.filter(filter);
};

interface FilterOptions {
  tags?: TopicDict;
  advisors?: TopicDict;
}

const noFilter = (student: IStudentSummary) => true;

const Explore = (props: IHomeProps) => {
  const { isExploring } = props;

  const students = useMemo(() => {
    if (!props.students) {
      return;
    }
    return queries.shuffle(props.students);
  }, [props.students]);

  const [filteredStudents, setFilteredStudents] = useState<
    IStudentSummary[] | undefined
  >();
  const [searchText, setSearchText] = useState<string>("");

  const tagMatch = useRouteMatch<{ tag: string }>("/filter/category/:tag");
  const advisorMatch = useRouteMatch<{ advisorId: string }>(
    "/filter/advisor/:advisorId"
  );

  const tag = tagMatch && tagMatch.params.tag;
  const advisorId = advisorMatch && advisorMatch.params.advisorId;

  useEffect(() => {
    const metaDescription = document.querySelector("meta[name='description']");

    if (metaDescription)
      metaDescription.setAttribute("description", "ITP Thesis Archive");

    const metaOgImageElement = document.querySelector(
      "meta[property='og:image']"
    );

    if (metaOgImageElement) metaOgImageElement.setAttribute("content", "");
  });

  useEffect(() => {
    document.title = generateTitle(tag, advisorId);
  }, [tag, advisorId]);

  const [{ search }, setSearch] = useState<{ search?: ISearch }>({});

  useEffect(() => {
    // load search if it hasn't been loaded and search text has been entered
    if (students && !search && searchText && searchText !== "") {
      setSearch({ search: buildSearch(students) });
    }
  }, [students, search, searchText]);

  useEffect(() => {
    if (!students) return;

    if (searchText && searchText !== "") {
      if (search) {
        setFilteredStudents(search(searchText));
      }
    } else if (tag) {
      setFilteredStudents(
        updateFilteredStudents(students, queries.matchesTag(tag))
      );
    } else if (advisorId) {
      setFilteredStudents(
        updateFilteredStudents(students, queries.matchesAdvisor(advisorId))
      );
    } else {
      setFilteredStudents(updateFilteredStudents(students, noFilter));
    }
  }, [students, tag, advisorId, searchText, search]);

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});

  useEffect(() => {
    if (students) {
      setFilterOptions(queries.getTagsAndAdvisors(students));
    }
  }, [students]);

  if (!filteredStudents) return <h2>loading...</h2>;

  return (
    <Container fluid>
      <div className="row">
        <DraggableCards studentsToShow={filteredStudents} />
      </div>
      <Footer
        {...filterOptions}
        show={isExploring}
        searchText={searchText}
        searchTextChanged={setSearchText}
        filteredStudents={filteredStudents}
      />
      )}
    </Container>
  );
};

export default Explore;
