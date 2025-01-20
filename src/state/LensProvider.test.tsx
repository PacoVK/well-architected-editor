import { render, act } from "@testing-library/react";
import { LensProvider } from "./LensProvider";
import { useLens } from "./LensHook";
import { WellArchitectedLens } from "../types";

const TestComponent = () => {
  const {
    lens,
    actions: { setLens, persistLens, addQuestion },
  } = useLens();

  return (
    <div>
      <div data-testid="lens-name">{lens.name}</div>
      <div data-testid="pillar-count">{lens.pillars.length}</div>
      <button
        onClick={() =>
          setLens({
            ...lens,
            name: "Updated Name",
          })
        }
        data-testid="update-name-btn"
      >
        Update Name
      </button>
      <button
        onClick={() => {
          const newLens: WellArchitectedLens = {
            ...lens,
            name: "Persisted Lens",
            pillars: [
              {
                id: "test_pillar",
                name: "Test Pillar",
                questions: [],
              },
            ],
          };
          persistLens(newLens);
        }}
        data-testid="persist-lens-btn"
      >
        Persist Lens
      </button>
      <button
        onClick={() => {
          addQuestion("Test Pillar", {
            id: "test_question",
            title: "Test Question",
            description: "Test Description",
            choices: [],
            riskRules: [],
          });
        }}
        data-testid="add-question-btn"
      >
        Add Question
      </button>
    </div>
  );
};

describe("LensProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  const testLens: WellArchitectedLens = {
    schemaVersion: "2021-11-01",
    name: "Test Lens",
    description: "Test Description",
    pillars: [],
  };

  it("should provide initial lens state", () => {
    const { getByTestId } = render(
      <LensProvider initialLens={testLens}>
        <TestComponent />
      </LensProvider>,
    );

    expect(getByTestId("lens-name")).toHaveTextContent("Test Lens");
    expect(getByTestId("pillar-count")).toHaveTextContent("0");
  });

  it("should update lens state", () => {
    const { getByTestId } = render(
      <LensProvider initialLens={testLens}>
        <TestComponent />
      </LensProvider>,
    );

    act(() => {
      getByTestId("update-name-btn").click();
    });

    expect(getByTestId("lens-name")).toHaveTextContent("Updated Name");
  });

  it("should persist lens to localStorage", () => {
    const { getByTestId } = render(
      <LensProvider initialLens={testLens}>
        <TestComponent />
      </LensProvider>,
    );

    act(() => {
      getByTestId("persist-lens-btn").click();
    });

    expect(localStorage.setItem).toHaveBeenCalled();
    expect(getByTestId("lens-name")).toHaveTextContent("Persisted Lens");
    expect(getByTestId("pillar-count")).toHaveTextContent("1");
  });

  it("should add question to pillar", () => {
    const initialLens: WellArchitectedLens = {
      ...testLens,
      pillars: [
        {
          id: "test_pillar",
          name: "Test Pillar",
          questions: [],
        },
      ],
    };

    const { getByTestId } = render(
      <LensProvider initialLens={initialLens}>
        <TestComponent />
      </LensProvider>,
    );

    act(() => {
      getByTestId("add-question-btn").click();
    });

    expect(localStorage.setItem).toHaveBeenCalled();
    const savedLens = JSON.parse(
      (localStorage.setItem as jest.Mock).mock.calls[0][1],
    );
    expect(savedLens.pillars[0].questions).toHaveLength(1);
    expect(savedLens.pillars[0].questions[0].title).toBe("Test Question");
  });
});
